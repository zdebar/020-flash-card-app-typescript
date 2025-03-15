import csv
import os
from gtts import gTTS

# Path to your CSV file
CSV_FILE = "../data/en-source/CZ-EN.csv"

# Output folder for MP3 files
OUTPUT_FOLDER = "../data/en-source/audio-uk"

# Ensure output folder exists
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def generate_audio_from_csv(csv_file: str):
    with open(csv_file, newline='', encoding='utf-8') as file:
        reader = csv.reader(file)

        next(reader)

        for row in reader:
            if len(row) < 3:
                continue 

            word = row[2].strip() 
            filename = os.path.join(OUTPUT_FOLDER, f"{word}.mp3")

            if os.path.exists(filename):
                print(f"Skipping (already exists): {filename}")
                continue

            tts = gTTS(text=word, lang="en", tld='co.uk', slow=False)
            tts.save(filename)

            print(f"Generated: {filename}")

# Run the function
generate_audio_from_csv(CSV_FILE)


