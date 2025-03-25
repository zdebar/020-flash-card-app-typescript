import os
from pydub import AudioSegment

# Define the source and output folders
source_folder = os.path.abspath("data/de-source/audio-de")
output_folder = os.path.abspath("data/de-source/audio-de/opus")
output_format = "opus"
output_bitrate = "16k"
os.makedirs(output_folder, exist_ok=True)

# Function to convert MP3 to Opus with a lower bitrate
def convert_mp3_to_opus(input_path, output_path, bitrate="64k"):
    audio = AudioSegment.from_mp3(input_path)
    audio.export(output_path, format=output_format, bitrate=bitrate)

# Process all MP3 files in the source folder
for filename in os.listdir(source_folder):
    if filename.endswith(".mp3"):
        input_path = os.path.join(source_folder, filename)
        output_filename = os.path.splitext(filename)[0] + "." + output_format
        output_path = os.path.join(output_folder, output_filename)
        convert_mp3_to_opus(input_path, output_path, bitrate=output_bitrate)
        print(f"Processed {filename} to {output_filename}")

print("All files processed successfully!")
