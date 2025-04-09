import os
import pandas as pd
import asyncio
from utils.pronunciation import get_IPA_pronunciation
from utils.audio_generation import generate_audio_for_words
from utils.prepare_words import clean_DataFrame, replace_german_article
from utils.helpers import async_read_excel, async_save_csv

async def process_csv_files_in_folder(input_folder: str, output_folder: str, audio_folder: str, file_index_start: int, file_index_end: int) -> None:
    """
    Process CSV files in a given folder and save the processed files to the output folder.

    file_index_start (int): INCLUSIVE
    file_index_end (int): EXCLUSIVE
    """
    os.makedirs(output_folder, exist_ok=True)

    # Get a sorted list of CSV files in the input folder
    csv_files = sorted([f for f in os.listdir(input_folder) if f.endswith(".csv")])
    selected_files = csv_files[file_index_start:file_index_end]

    tasks = [
        process_single_csv_file(file_name, input_folder, output_folder, audio_folder)
        for file_name in selected_files
    ]
    await asyncio.gather(*tasks)

    print("Processing complete.")

async def process_single_csv_file(file_name: str, input_folder: str, output_folder: str, audio_folder: str) -> None:
    """Process a single CSV file."""

    # Read the CSV file into a DataFrame

    input_path = os.path.join(input_folder, file_name)
    print(f"Processing file: {input_path}")
    df = pd.read_csv(input_path)

    # Strip whitespace from the DataFrame, drop empty rows
    df = clean_DataFrame(df)

    # Fix German articles
    df["trg"] = df["trg"].apply(replace_german_article)

    # Get IPA pronunciation for each word
    df["prn"] = await asyncio.gather(
        *[get_IPA_pronunciation(word.replace(",", ""), "de") for word in df["trg"]]
    )

    # Generate audio files for each word
    audio_files = await generate_audio_for_words(df, audio_folder, "de")
    df["audio"] = audio_files

    # Reorder columns
    final_df = df[["src", "trg", "prn", "audio"]]

    # Save the processed CSV file
    output_file = os.path.join(output_folder, os.path.basename(file_name))
    await async_save_csv(final_df, output_file)
    print(f"Saved processed CSV: {file_name}")

if __name__ == "__main__":

    mid_folder = os.path.abspath("data/de-source/csv_output")  
    output_folder = os.path.abspath("data/de-source/csv_import_db")
    audio_folder = os.path.abspath("data/de-source/audio-de")
    file_index_start = 0 # Including
    file_index_end = 1  # Excluding 
    asyncio.run(process_csv_files_in_folder(mid_folder, output_folder, audio_folder, file_index_start, file_index_end))

