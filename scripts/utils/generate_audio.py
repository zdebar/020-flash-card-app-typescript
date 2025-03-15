import os
import csv
import re
from gtts import gTTS

def clean_filename(filename: str) -> str:
    # Replace any invalid characters with an underscore
    return re.sub(r'[<>:"/\\|?*]', '_', filename)

def generate_mp3_from_csv(language: str, csv_file: str, output_folder: str, column: int):
    os.makedirs(output_folder, exist_ok=True)

    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader)

        for row in reader:
            if len(row) <= column:
                continue 

            word = row[column].strip()
            cleaned_word = clean_filename(word)  # Clean the word for valid file names
            filename = os.path.join(output_folder, f"{cleaned_word}.mp3")

            if os.path.exists(filename):
                print(f"Skipping (already exists): {filename}")
                continue

            tts = gTTS(text=word, lang=language, slow=False)
            tts.save(filename)

            print(f"Generated: {filename}")

