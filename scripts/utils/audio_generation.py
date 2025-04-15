import asyncio
import re
from gtts import gTTS
import os
import pandas as pd

async def generate_audio_for_words(df: pd.DataFrame, audio_folder: str, language: str) -> list[str]:
    audio_files: list[str] = []
    audio_tasks: list[asyncio.Task] = []

    def clean_filename(filename: str) -> str:
        filename = filename.lower()
        filename = re.sub(r'[^\w\s]', '', filename)  # Remove special characters (keep alphanumeric and spaces)
        filename = filename.replace(" ", "_")  # Replace spaces with underscores
        return filename
    
    def add_extension(filename: str) -> str:            
        return filename + ".mp3"

    # Process audio files
    for word in df["trg"]:
        cleaned_word = clean_filename(word)
        audio_files.append(cleaned_word)
        extension_word = add_extension(cleaned_word)	

        audio_path = os.path.join(audio_folder, extension_word)
        if not os.path.exists(audio_path):
            tts = gTTS(text=word, lang=language, slow=False)  
            audio_tasks.append(async_save_audio(tts, audio_path))
            print(f"Queued audio generation: {extension_word}")
        else:
            print(f"Skipping (audio already exists): {extension_word}")

    await asyncio.gather(*audio_tasks)
    return audio_files

async def generate_audio_with_google_cloud(df: pd.DataFrame, audio_folder: str, language_code: str) -> list[str]:
    from google.cloud import texttospeech

    client = texttospeech.TextToSpeechClient()
    audio_files: list[str] = []
    audio_tasks: list[asyncio.Task] = []

    def clean_filename(filename: str) -> str:
        filename = filename.lower()
        filename = re.sub(r'[\^\w\s]', '', filename)  # Remove special characters (keep alphanumeric and spaces)
        filename = filename.replace(" ", "_")  # Replace spaces with underscores
        return filename

    def add_extension(filename: str) -> str:
        return filename + ".mp3"

    # Process audio files
    for word in df["trg"]:
        cleaned_word = clean_filename(word)
        audio_files.append(cleaned_word)
        extension_word = add_extension(cleaned_word)

        audio_path = os.path.join(audio_folder, extension_word)
        if not os.path.exists(audio_path):
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

            async def save_audio():
                with open(audio_path, "wb") as out:
                    out.write(response.audio_content)

            audio_tasks.append(asyncio.to_thread(save_audio))
            print(f"Queued audio generation with Google Cloud: {extension_word}")
        else:
            print(f"Skipping (audio already exists): {extension_word}")

    await asyncio.gather(*audio_tasks)
    return audio_files

# Function to save audio asynchronously
async def async_save_audio(tts, filename):
    await asyncio.to_thread(tts.save, filename)


