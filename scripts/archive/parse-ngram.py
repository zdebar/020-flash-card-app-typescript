import asyncio
import aiohttp
import csv
import re
from pathlib import Path
import subprocess
from typing import Optional, List

# For parsing ngram_freq.cv with english frequency words

# File paths and constants
folder_path = Path(r"D:/Active/020-flash-card-app-typescript/data/en-source")
input_path = folder_path / "ngram_freq.csv"
output_path = folder_path / "CZ-EN.csv"

NUMBER_OF_WORDS = 500
ACCENT = "en-gb"  # en-gb for british, en-us for american

def clean_word(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

async def get_IPA_pronunciation(word: str, accent: str) -> Optional[str]:
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
    result = subprocess.run(
        [espeak_ng_path, "-q", "--ipa", "-v", accent, word],
        capture_output=True, text=True, encoding='utf-8'
    )
    return result.stdout.strip() if result.stdout else None

async def translate_word(session: aiohttp.ClientSession, word: str, source_language: str, target_language: str) -> str | None:
    """
    Translates a word from Source language to Target language using Google Translate.

    Args:
        language shortcuts according to Google Translate API
            "en": english
            "cs": czech

    Returns:
        str: if translation given
        None: if not given
    """
    params = {
        "client": "gtx",
        "sl": source_language,
        "tl": target_language,
        "dt": "t",
        "q": word
    }
    GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"

    try:
        async with session.get(GOOGLE_TRANSLATE_URL, params=params) as response:
            data = await response.json()
            return data[0][0][0].lower() if data else None
    except Exception as e:
        print(f"Error translating word '{word}': {e}")
        return None

async def process_word(session: aiohttp.ClientSession, idx: int, target: str, accent: str) -> List[str] | None:
    """
    Translates and gets the pronunciation of a word.
    """
    source = await translate_word(session, target, "en", "cs")
    pronunciation = await get_IPA_pronunciation(target, accent)
    if source == "N/A" or pronunciation is None:
        return None
    return [idx, source, target, pronunciation]

async def main() -> None:
    """
    Reads words from CSV, translates, gets pronunciations, and writes results to another CSV.
    """
    words = []
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(words) >= NUMBER_OF_WORDS:
                break
            word = clean_word(row[0].lower())
            if word and len(word) > 1:
                words.append(word)

    async with aiohttp.ClientSession() as session:
        tasks = [process_word(session, idx, word, ACCENT) for idx, word in enumerate(words, start=1)]
        results = await asyncio.gather(*tasks)

    # Filter out None results (in case of errors or missing data)
    results = [result for result in results if result is not None]

    # Write the results to the output CSV
    with open(output_path, "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(results)

# Run the main function
asyncio.run(main())
