import os
import pandas as pd
import asyncio
from utils.pronunciation import get_IPA_pronunciation
from utils.translation import translate_to_czech_no_api_key
from utils.audio_generation import generate_audio_for_words
from utils.prepare_words import clean_DataFrame, choose_british
from utils.helpers import async_save_csv

async def prepare_english_words(file_name: str, output_folder: str, audio_folder: str, word_number: int) -> None:
   
    # Load the first word_number words from the CSV file, selecting only the first column and naming it "trg"
    df = pd.read_csv(file_name, usecols=[0,1], nrows=word_number, names=["trg","cefr"], header=None)
 
    # Strip whitespace from the DataFrame, drop empty rows
    df = clean_DataFrame(df)
    df = choose_british(df)

    # Get czech translation for each word
    df["src"] = await asyncio.gather(
        *[asyncio.to_thread(translate_to_czech_no_api_key, word.replace(",", "")) for word in df["trg"]]
    )

    # Get IPA pronunciation for each word
    df["prn"] = await asyncio.gather(
        *[get_IPA_pronunciation(word.replace(",", ""), "en-us") for word in df["trg"]]
    )

    # Create folders if they don't exist
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    # Generate audio files in the subfolder
    audio_files = await generate_audio_for_words(df, audio_folder, "en")
    df["audio"] = audio_files

    # Reorder columns
    final_df = df[["src", "trg", "prn", "cefr", "audio"]]

    # Save the processed CSV file
    output_file = os.path.join(output_folder, os.path.basename("CZ_EN_CEFR.csv"))
    await async_save_csv(final_df, output_file)
    print(f"Saved processed CSV: {"CZ_EN_CEFR.csv"}")

if __name__ == "__main__":

    input_file = os.path.abspath("../data/en-source/ENGLISH_CERF_WORDS.csv")  
    output_folder = os.path.abspath("../data/en-source/output")
    audio_folder = os.path.abspath("../data/en-source/audio/mp3/1")
    word_number = 1000  # Number of words to process

    asyncio.run(prepare_english_words(input_file, output_folder, audio_folder, word_number))

