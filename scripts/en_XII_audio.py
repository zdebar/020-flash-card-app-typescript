import os
import pandas as pd
import asyncio
from utils.audio_generation import generate_audio_with_google_cloud


async def create_audio_files(file_name: str, audio_folder: str, word_number: int) -> None:
    # Load the first word_number rows from the CSV file, including all columns
    df = pd.read_csv(file_name, nrows=word_number)

    # Create folders if they don't exist
    os.makedirs(audio_folder, exist_ok=True)

    # Generate audio files for the 'trg' column
    audio_files = await generate_audio_with_google_cloud(df['trg'], audio_folder, "en")

    # Add filenames to the 'audio' column
    df['audio'] = audio_files

    # Save the entire updated DataFrame back to the same file
    df.to_csv(file_name, index=False)

if __name__ == "__main__":
    input_file = os.path.abspath("../data/en-source/output/cz-en-sequenced.csv")  
    audio_folder = os.path.abspath("../data/en-source/audio/mp3/1")
    word_number = 10

    asyncio.run(create_audio_files(input_file, audio_folder, word_number))
