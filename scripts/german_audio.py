from utils.generate_audio import generate_mp3_from_csv

# Example usage
CSV_FILE = "../data/de-source/CZ-DE.csv"
OUTPUT_FOLDER = "../data/de-source/audio-de"
COLUMN_INDEX = 1  # Adjust this to the correct column index (0-based)
generate_mp3_from_csv("de", CSV_FILE, OUTPUT_FOLDER, COLUMN_INDEX)