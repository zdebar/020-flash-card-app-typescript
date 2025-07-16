import os
import pandas as pd
import asyncio
from utils.pronunciation import get_IPA_pronunciation
from utils.translation import translate_to_czech_Google_Translate
from utils.audio import generate_audio_with_google_cloud
from utils.prepare_words import clean_DataFrame
from utils.helpers import async_save_csv
from utils.convert_to_opus import convert_mp3_to_opus

parts = {
    "noun": 1,
    "pronoun": 2,
    "verb": 3,
    "adjective": 4,
    "adverb": 5,
    "preposition": 6,
    "conjunction": 7,
    "interjection": 8,
    "noun phrase": 9,
    "verb phrase": 10,
    "numeral": 11,
    "determiner": 12
}

async def prepare_spanish_words(file_name: str, output_file: str, audio_folder: str, opus_folder: str) -> None:
    # Load the first word_number words from the CSV file, ensuring required columns exist
    df = pd.read_csv(file_name, header=0, na_filter=False)

    required_columns = ["id", "czech", "spanish", "part_id", "pronunciation", "audio", "sequence", "gender"]
    for column in required_columns:
        if column not in df.columns:
            df[column] = "" 

    # Strip whitespace from the DataFrame, drop empty rows
    df = clean_DataFrame(df)

    # Get IPA pronunciation for each word
    pronunciations = []
    for spanish in df["spanish"]:
        try:
            if spanish:
                pronunciation = await get_IPA_pronunciation(spanish.replace(",", ""), "es")
            else:
                pronunciation = ""  
        except Exception as e:
            print(f"Error getting IPA pronunciation for '{spanish}': {e}")
            pronunciation = "" 
        pronunciations.append(pronunciation)

    df["pronunciation"] = pronunciations

    # Ensure the audio folder exists
    os.makedirs(audio_folder, exist_ok=True)
    os.makedirs(opus_folder, exist_ok=True)

    # Generate audio files for the 'spanish' column
    audio_files = await generate_audio_with_google_cloud(df["spanish"], audio_folder, "es")
    df['audio'] = audio_files
    
    # Convert MP3 files to Opus format if they do not already exist
    output_format = "opus"
    output_bitrate = "16k"
    for filename in os.listdir(audio_folder):
        if filename.endswith(".mp3"):
            input_path = os.path.join(audio_folder, filename)
            output_filename = os.path.splitext(filename)[0] + "." + output_format
            output_path = os.path.join(opus_folder, output_filename)

            # Check if the output file already exists
            if os.path.exists(output_path):
                continue

            # Check if the file is valid and not empty
            if os.path.getsize(input_path) == 0:
                print(f"Skipping empty file: {filename}")
                continue

            try:
                convert_mp3_to_opus(input_path, output_path, bitrate=output_bitrate)
                print(f"Processed {filename} to {output_filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    df['audio'] = audio_files

    # Convert part to numeric value
    df["part_id"] = df["part_id"].apply(lambda x: int(parts.get(x)) if parts.get(x) is not None else None)

    # Assign sequential numbers to 'sequence' starting from 1
    df['sequence'] = range(1, len(df) + 1)

    # Remove the output file if it already exists
    if os.path.exists(output_file):
        os.remove(output_file)


    # Save the processed CSV file
    await async_save_csv(df, output_file)

async def process_all_files_in_directory(input_directory: str, output_directory: str, audio_folder: str, opus_folder: str) -> None:
    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Iterate over all CSV files in the input directory
    for file_name in os.listdir(input_directory):
        if file_name.endswith(".csv"):
            input_file = os.path.join(input_directory, file_name)
            output_file = os.path.join(output_directory, f"processed_{file_name}")
            print(f"Processing {input_file}...")
            await prepare_spanish_words(input_file, output_file, audio_folder, opus_folder)

if __name__ == "__main__":
    input_directory = os.path.abspath("../data-spanish/prepare")  # Directory containing input CSV files
    output_directory = os.path.abspath("../data-spanish/prepare/processed")  # Directory to save processed files
    audio_folder = os.path.abspath("../data-spanish/prepare/audio")
    opus_folder = os.path.abspath("../data-spanish/prepare/opus")
    

    asyncio.run(process_all_files_in_directory(input_directory, output_directory, audio_folder, opus_folder))

