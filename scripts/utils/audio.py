import asyncio
import re
import unicodedata
from gtts import gTTS
import os
import pandas as pd
from google.cloud import texttospeech
from dotenv import load_dotenv

# Now the GOOGLE_APPLICATION_CREDENTIALS variable is available
load_dotenv()
credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
print(f"Using credentials from: {credentials_path}")

async def generate_audio_with_google_cloud(df: pd.DataFrame, audio_folder: str, language_code: str) -> list[str]:

    client = texttospeech.TextToSpeechClient()
    audio_files: list[str] = []
    audio_tasks: list[asyncio.Task] = []

    def clean_filename(filename: str) -> str:
        filename = filename.lower()
        # Normalize to remove accents
        filename = unicodedata.normalize('NFD', filename)
        filename = ''.join(char for char in filename if unicodedata.category(char) != 'Mn')  # Remove diacritical marks
        filename = re.sub(r'[^\w\s]', '', filename)  # Remove special characters (keep alphanumeric and spaces)
        filename = filename.replace(" ", "_")  # Replace spaces with underscores
        return language_code + "_" + filename

    def add_extension(filename: str) -> str:
        return filename + ".mp3"

    def save_audio(audio_content, path):
        try:
            with open(path, "wb") as out:
                out.write(audio_content)
        except Exception as e:
            print(f"Error saving audio file {path}: {e}")

    # Process audio files
    for word in df:
        cleaned_word = clean_filename(word)
        audio_files.append(cleaned_word)
        extension_word = add_extension(cleaned_word)

        audio_path = os.path.join(audio_folder, extension_word)
        if not os.path.exists(audio_path):
            try:
                synthesis_input = texttospeech.SynthesisInput(text=word)

                voice = texttospeech.VoiceSelectionParams(
                    language_code=language_code, 
                    ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
                )

                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.MP3
                )

                response = client.synthesize_speech(
                    input=synthesis_input, voice=voice, audio_config=audio_config
                )

                audio_tasks.append(asyncio.to_thread(save_audio, response.audio_content, audio_path))
                print(f"Queued audio generation with Google Cloud: {extension_word}")
            except Exception as e:
                print(f"Error generating audio for word '{word}': {e}")
        # else:
        #     print(f"Skipping (audio already exists): {extension_word}")

    await asyncio.gather(*audio_tasks)
    return audio_files

# Function to save audio asynchronously
async def async_save_audio(tts, filename):
    await asyncio.to_thread(tts.save, filename)


