import csv
import os
import asyncio
from gtts import gTTS

async def save_audio(word: str, filename: str):
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, save_audio_sync, word, filename)

def save_audio_sync(word: str, filename: str):
    tts = gTTS(text=word, lang="en", slow=False)
    tts.save(filename)

async def generate_mp3_from_csv_async(language: str, csv_file: str, output_folder: str, column: int):
    os.makedirs(output_folder, exist_ok=True)

    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)

        tasks = []

        for row in reader:
            if len(row) <= column:
                continue 

            word = row[column].strip()
            filename = os.path.join(output_folder, f"{word}.mp3")

            if os.path.exists(filename):
                print(f"Skipping (already exists): {filename}")
                continue

            print(f"Adding task for: {word}")
            tasks.append(save_audio(word, filename))

        await asyncio.gather(*tasks)
