import os
import pandas as pd
import asyncio
from utils.audio_generation import generate_audio_with_google_cloud
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

async def create_audio_files(file_name: str, output_file: str, audio_folder: str, start_line: int, end_line: int) -> None:
    # Load the specific range of lines from the CSV file, including all columns
    df = pd.read_csv(file_name, skiprows=range(1, start_line), nrows=end_line - start_line + 1)

    # Create folders if they don't exist
    os.makedirs(audio_folder, exist_ok=True)

    # Generate audio files for the 'trg' column
    audio_files = await generate_audio_with_google_cloud(df["trg"], audio_folder, "en")

    # Add filenames to the 'audio' column
    df['audio'] = audio_files

    # Save the entire updated DataFrame back to the same file
    df.to_csv(output_file, index=False)

if __name__ == "__main__":
    input_file = os.path.abspath("data/en-source/output/cz-en-sequenced.csv")  
    output_file = os.path.abspath("data/en-source/output/cz-en-sequenced-audio.csv")
    audio_folder = os.path.abspath("data/en-source/audio/mp3/1")
    start_line = 0
    end_line = 10000

    asyncio.run(create_audio_files(input_file, output_file, audio_folder, start_line, end_line))
