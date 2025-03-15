import asyncio
import re
import pronouncing
from gtts import gTTS
import os

def clean_word(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

async def get_IPA_pronunciation(word: str, accent: str) -> str | None:
    """
    Gets IPA pronunciation of the word using espeak-ng. Works with espeak_ng installed in predefined location.

    Args:
        word (str): source word
        accent (str): intended accent
            "en-gb": british english
            "en-us": us english
            "fr": french
            "de": german
            "es": spanish

    Returns:
        str: IPA transcription
    """
    espeak_ng_path = r"C:/Program Files/eSpeak NG/espeak-ng.exe"
    result = await asyncio.create_subprocess_exec(
        espeak_ng_path, "-q", "--ipa", "-v", accent, word,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await result.communicate()
    
    # Decode the output and return
    return stdout.decode('utf-8').strip() if stdout else None

def get_english_pronunciation(word: str) -> str | None:
    """
    Returns the ARPAbet pronunciation for an English word using the `pronouncing` module.

    Args:
        word (str): The English word for which to retrieve the ARPAbet pronunciation.

    Returns:
        str | None: The ARPAbet pronunciation of the word if found, otherwise None.

    """
    phones = pronouncing.phones_for_word(word)
    return phones[0] if phones else None

def arpabet_to_ipa_conversion(arpabet: str) -> str:
    """ 
    Converts pronunciation from arpabet format to IPA format using in-function conversion table.

    Args:
        arpabet (str): ARPAbet phonetic transcription of a word or phrase.

    Returns:
        str: IPA transcription
    """
    arpabet_to_ipa = {
    'AA1': 'ɑː', 'AH0': 'ə', 'AH1': 'ʌ', 'AO0': 'ɔː', 'AO1': 'ɔː', 'AW0': 'aʊ', 'AY0': 'aɪ',
    'AE1': 'æ', 'AE0': 'ə', 'AY1': 'aɪ', 'B': 'b', 'CH': 'ʧ', 'D': 'd', 'DH': 'ð', 'EH0': 'ɛ', 'EH1': 'eɪ', 
    'ER0': 'ɜːr', 'ER1': 'ɜːr', 'EY0': 'eɪ', 'EY1': 'eɪ', 'F': 'f', 'G': 'g', 'HH': 'h', 'IH0': 'ɪ', 'IH1': 'ɪ', 
    'IY0': 'iː', 'IY1': 'iː', 'JH': 'ʤ', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ŋ', 'OW0': 'əʊ', 'OW1': 'əʊ', 
    'OY0': 'ɔɪ', 'OY1': 'ɔɪ', 'P': 'p', 'R': 'r', 'S': 's', 'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'UH0': 'ʊ', 'UH1': 'ʊ', 
    'UW0': 'uː', 'V': 'v', 'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ', 'IH2': 'ɪ', 'EH2': 'ɛ', 'AY2': 'aɪ', 'AY1': 'aɪ',
    'AA2': 'ɑː', 'EY2': 'eɪ', 'AA0': 'ɑː', 'AW1': 'aʊ', 'UW1': 'uː', 'OW2': 'əʊ', 'AE2': 'æ', 'IY2': 'iː', 
    'ER2': 'ɜːr', 'UH2': 'ʊ', 'AO2': 'ɔː', 'AH2': 'ə', 'UW2': 'uː', 'AW2': 'aʊ', "OY2": "ɔɪ"
    }

    if not arpabet:
        return "N/A"
    
    arpabet_words = arpabet.split()
    ipa_words = []

    for word in arpabet_words:
        if word in arpabet_to_ipa:
            ipa_words.append(arpabet_to_ipa[word])
        else:
            print(f"Unknown phonem: {word}")
            ipa_words.append(word)
    return ''.join(ipa_words)

# Function to generate audio for words
async def generate_audio_for_words(df, audio_folder):
    audio_files = []
    audio_tasks = []
    
    # Clean the word for valid file names
    def clean_filename(filename: str) -> str:
        filename = filename.lower()
        filename = re.sub(r'[^\w\s]', '', filename)  # Remove special characters (keep alphanumeric and spaces)
        filename = filename.replace(" ", "_")  # Replace spaces with underscores
        return filename + ".mp3"
    
    # Process audio files
    for word in df["trg"]:
        cleaned_word = clean_filename(word)
        audio_files.append(cleaned_word)
        
        audio_path = os.path.join(audio_folder, cleaned_word)
        if not os.path.exists(audio_path):
            tts = gTTS(text=word, lang="de", slow=False)
            audio_tasks.append(async_save_audio(tts, audio_path))
            print(f"Queued audio generation: {cleaned_word}")
        else:
            print(f"Skipping (audio already exists): {cleaned_word}")

    await asyncio.gather(*audio_tasks)
    return audio_files

# Function to save audio asynchronously
async def async_save_audio(tts, filename):
    await asyncio.to_thread(tts.save, filename)

# Function to save DataFrame to CSV
async def async_save_csv(df, output_file):
    await asyncio.to_thread(df.to_csv, output_file, index=False)