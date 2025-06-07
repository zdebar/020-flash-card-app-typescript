import os
from pydub import AudioSegment  # type: ignore
from pydub.silence import detect_nonsilent  # type: ignore
from typing import Union, List, Any

# This script converts MP3 files to Opus format with a lower bitrate. Also trims silence from the beginning and end of the audio files.

# Define the source and output folders
source_folder = os.path.abspath("../../data/en-source/audio/mp3/1")
output_folder = os.path.abspath("../../data/en-source/audio/opus_2")
output_format = "opus"
output_bitrate = "16k"
os.makedirs(output_folder, exist_ok=True)

# Function to convert MP3 to Opus with a lower bitrate
def convert_mp3_to_opus(input_path: Union[str, os.PathLike[str]], output_path: Union[str, os.PathLike[str]], bitrate: str = "64k") -> None:
    try:
        audio = AudioSegment.from_mp3(input_path) 

        # Detect and trim silence
        silence_threshold = -50  # dBFS (must be an integer)
        silence_chunk_length = 100  # milliseconds
        non_silent_ranges: List[Any] = detect_nonsilent( 
            audio, min_silence_len=silence_chunk_length, silence_thresh=silence_threshold
        )

        if non_silent_ranges:
            start_trim: int = non_silent_ranges[0][0]
            end_trim: int = non_silent_ranges[-1][1]
            audio = audio[start_trim:end_trim]  # Correct slicing of AudioSegment

        audio.export(output_path, format=output_format, bitrate=bitrate) 
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Process all MP3 files in the source folder
if __name__ == "__main__":
    for filename in os.listdir(source_folder):
        if filename.endswith(".mp3"):
            input_path = os.path.join(source_folder, filename)
            output_filename = os.path.splitext(filename)[0] + "." + output_format
            output_path = os.path.join(output_folder, output_filename)

            # Check if the output file already exists
            if os.path.exists(output_path):
                continue

            convert_mp3_to_opus(input_path, output_path, bitrate=output_bitrate)
            print(f"Processed {filename} to {output_filename}")
    print("All files processed successfully!")
