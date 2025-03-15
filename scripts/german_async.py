import os
import pandas as pd
import asyncio
from utils.helpers import get_IPA_pronunciation
from utils.helpers import generate_audio_for_words, async_save_csv

# Function to read the Excel file asynchronously
async def async_read_excel(input_file: str, sheet_name: str):
    return await asyncio.to_thread(pd.read_excel, input_file, sheet_name=sheet_name, usecols=[0, 1], header=None, names=["trg", "src"])

# Function to clean the text data in the DataFrame
def clean_data(df):
    df["src"] = df["src"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
    df["trg"] = df["trg"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
    df = df.dropna(subset=["src", "trg"])
    df = df[(df["src"] != "") & (df["trg"] != "")]
    return df

# Function to replace articles in the "trg" column
def replace_german_article(word):
    if word.startswith("e "):
        return "die " + word[2:]
    elif word.startswith("r "):
        return "der " + word[2:]
    elif word.startswith("s "):
        return "das " + word[2:]
    return word

# Function to process each sheet and generate the required CSV and audio
async def process_sheet(sheet_name, input_file, output_folder, audio_folder):
    print(f"Processing sheet: {sheet_name}")
    df = await async_read_excel(input_file, sheet_name)

    # Clean data
    df = clean_data(df)

    # Replace articles in "trg" column
    df["trg"] = df["trg"].apply(replace_german_article)

    # Get IPA pronunciation for each word
    prn_list = await asyncio.gather(
        *[get_IPA_pronunciation(word.replace(",", ""), "de") for word in df["trg"]]
    )

    df["prn"] = prn_list

    # Generate audio files for each word
    audio_files = await generate_audio_for_words(df, audio_folder, "de")
    df["audio"] = audio_files

    # Add order and language columns
    df["seq"] = df.index + 1
    df["language"] = "de"

    # Reorder columns
    final_df = df[["src", "trg", "prn", "audio", "language", "seq"]]

    # Save the CSV file
    output_file = os.path.join(output_folder, f"{sheet_name}.csv")
    await async_save_csv(final_df, output_file)
    print(f"Saved CSV for sheet '{sheet_name}'.")

# Main function to process all sheets starting from a specified sheet index
async def process_xlsx_to_csv(input_file: str, output_folder: str, audio_folder: str, start_sheet_index: int) -> None:
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    # Read the Excel file
    xlsx = pd.ExcelFile(input_file)

    # Get sheet names and process only starting from the desired sheet
    sheet_names = xlsx.sheet_names[start_sheet_index:] 

    # Process each sheet separately
    tasks = [process_sheet(sheet_name, input_file, output_folder, audio_folder) for sheet_name in sheet_names]

    # Wait for all tasks to finish
    await asyncio.gather(*tasks)

    print("Processing complete.")

# Run the async function
input_file = '../data/de-source/German_Vocab.xlsx'
output_folder = '../data/de-source/csv_output'
audio_folder = '../data/de-source/audio-de'
start_sheet_index = 0
asyncio.run(process_xlsx_to_csv(input_file, output_folder, audio_folder, start_sheet_index))
