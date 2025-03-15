import os
import pandas as pd
import asyncio
from utils.helpers import get_IPA_pronunciation
from gtts import gTTS
import re

async def process_xlsx_to_csv(input_file: str, output_folder: str, audio_folder: str) -> None:
    xlsx = pd.ExcelFile(input_file)
    
    # Create the output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    # Loop through each sheet in the Excel file
    for sheet_name in xlsx.sheet_names:
        df = pd.read_excel(input_file, sheet_name=sheet_name, usecols=[0, 1], header=None, names=["trg", "src"])
        
        # Clean the data
        df["src"] = df["src"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
        df["trg"] = df["trg"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
        df = df.dropna(subset=["src", "trg"])
        df = df[(df["src"] != "") & (df["trg"] != "")]

        # Replace phrases starting with 'e', 'r', or 's' with 'die', 'der', 'das' respectively
        def replace_article(word):
            if word.startswith("e "):
                return "die " + word[2:]
            elif word.startswith("r "):
                return "der " + word[2:]
            elif word.startswith("s "):
                return "das " + word[2:]
            return word
        
        # Apply replacement to the 'trg' column
        df["trg"] = df["trg"].apply(replace_article)

        # Asynchronously process IPA pronunciation for each word
        prn_list = await asyncio.gather(
            *[get_IPA_pronunciation(word.replace(",", ""), "de") for word in df["trg"]]
        )
        
        # Add the pronunciation as a new column
        df["prn"] = prn_list

        # Generate audio for each word
        def clean_filename(filename: str) -> str:
            # Replace special characters with underscores, convert to lowercase, and replace spaces with underscores
            filename = filename.lower()
            filename = re.sub(r'[^\w\s]', '', filename)  # Remove special characters (keep alphanumeric and spaces)
            filename = filename.replace(" ", "_")  # Replace spaces with underscores
            return filename + ".mp3"
        
        audio_files = []
        for word in df["trg"]:
            cleaned_word = clean_filename(word)  # Clean the word for valid file names
            audio_files.append(cleaned_word)
            
            if not os.path.exists(os.path.join(audio_folder, cleaned_word)):
                tts = gTTS(text=word, lang="de", slow=False)
                tts.save(os.path.join(audio_folder, cleaned_word))
                print(f"Generated audio: {cleaned_word}")
            else:
                print(f"Skipping (audio already exists): {cleaned_word}")
        
        df["audio"] = audio_files

        # Add 'order' column for each sheet
        df["seq"] = df.index + 1  # Add an 'order' column with row index starting at 1
        final_df = df[["src", "trg", "prn", "audio", "seq"]]
        
        # Save to CSV for each sheet with sheet name
        output_file = os.path.join(output_folder, f"{sheet_name}.csv")
        final_df.to_csv(output_file, index=False)
        print(f"Processing complete for sheet '{sheet_name}'. Output saved to {output_file}")

# Run the async function
input_file = '../data/de-source/German_Vocab.xlsx'
output_folder = '../data/de-source/csv_output'
audio_folder = '../data/de-source/audio-de'
asyncio.run(process_xlsx_to_csv(input_file, output_folder, audio_folder))
