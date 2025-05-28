import os
import pandas as pd
import asyncio
from utils.pronunciation import get_IPA_pronunciation
from utils.translation import translate_to_czech_Google_Translate
from utils.audio import generate_audio_with_google_cloud
from utils.prepare_words import clean_DataFrame
from utils.helpers import async_save_csv
from utils.convert_to_opus import convert_mp3_to_opus

async def prepare_english_words(file_name: str, output_folder: str, audio_folder: str, opus_folder: str) -> None:
   
    # Load the first word_number words from the CSV file, ensuring required columns exist
    df = pd.read_csv(file_name, header=0)

    required_columns = ["id", "czech", "english", "pronunciation", "audio", "item_order"]
    for column in required_columns:
        if column not in df.columns:
            df[column] = "" 

    # Strip whitespace from the DataFrame, drop empty rows
    df = clean_DataFrame(df)

    # Get Czech translation for each word if it does not already exist
    df["czech"] = await asyncio.gather(
        *[
            asyncio.to_thread(translate_to_czech_Google_Translate, word.replace(",", ""))
            if czech else asyncio.to_thread(lambda x: x, czech)  
            for word, czech in zip(df["english"], df["czech"])
        ]
    )

    # Get IPA pronunciation for each word
    df["pronunciation"] = await asyncio.gather(
        *[get_IPA_pronunciation(word.replace(",", ""), "en-us") for word in df["english"]]
    )

    # Ensure the audio folder exists
    os.makedirs(audio_folder, exist_ok=True)
    os.makedirs(opus_folder, exist_ok=True)

    # Generate audio files for the 'trg' column
    audio_files = await generate_audio_with_google_cloud(df["english"], audio_folder, "en")
    df['audio'] = audio_files
    
    # Convert MP3 files to Opus format if they do not already exist
    output_format = "opus"
    output_bitrate = "16k"
    for filename in os.listdir(mp3_folder):
        if filename.endswith(".mp3"):
            input_path = os.path.join(mp3_folder, filename)
            output_filename = os.path.splitext(filename)[0] + "." + output_format
            output_path = os.path.join(opus_folder, output_filename)

            # Check if the output file already exists
            if os.path.exists(output_path):
                continue

        convert_mp3_to_opus(input_path, output_path, bitrate=output_bitrate)
        print(f"Processed {filename} to {output_filename}")

    df['audio'] = audio_files

    # Assign sequential numbers to 'item_order' starting from 1
    df['item_order'] = range(1, len(df) + 1)

    # Remove the output file if it already exists
    if os.path.exists(output_file):
        os.remove(output_file)

    # Save the processed CSV file
    await async_save_csv(df, output_file)

if __name__ == "__main__":

    input_file = os.path.abspath("../data/en-source/grammar/015_towork.csv")  
    output_file = os.path.abspath("../data/en-source/grammar/015_towork_DONE.csv")
    mp3_folder = os.path.abspath("../data/en-source/grammar/015/mp3")
    opus_folder = os.path.abspath("../data/en-source/grammar/015/opus")

    asyncio.run(prepare_english_words(input_file, output_file, mp3_folder, opus_folder))

