import asyncio
import aiohttp
import csv
import re
from pathlib import Path
import subprocess
from typing import Optional, List

# For parsing ngram_freq.cv with english frequency words

# File paths and constants
folder_path = Path(r"D:/Active/020-flash-card-app-typescript/backend/data/en-source")
input_path = folder_path / "ngram_freq.csv"
output_path = folder_path / "CZ-EN.csv"

NUMBER_OF_WORDS = 500
GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"
ACCENT = "en-gb"  # en-gb for british, en-us for american

def clean_word(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

async def get_pronunciation(word: str, accent: str = ACCENT) -> Optional[str]:
    """
    Gets IPA pronunciation of the word using espeak-ng.
    """
    espeak_ng_path = r"C:/Program Files/eSpeak NG/espeak-ng.exe"
    result = subprocess.run(
        [espeak_ng_path, "-q", "--ipa", "-v", accent, word],
        capture_output=True, text=True, encoding='utf-8'
    )
    return "/" + result.stdout.strip() + "/" if result.stdout else None

async def translate_word(session: aiohttp.ClientSession, word: str) -> Optional[str]:
    """
    Translates a word from English to Czech using Google Translate.
    """
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": "cs",
        "dt": "t",
        "q": word
    }
    try:
        async with session.get(GOOGLE_TRANSLATE_URL, params=params) as response:
            data = await response.json()
            return data[0][0][0].lower() if data else None
    except Exception as e:
        print(f"Error translating word '{word}': {e}")
        return "N/A"

async def process_word(session: aiohttp.ClientSession, idx: int, word: str) -> Optional[List[str]]:
    """
    Translates and gets the pronunciation of a word.
    """
    czech = await translate_word(session, word)
    pronunciation = await get_pronunciation(word)
    if czech == "N/A" or pronunciation is None:
        return None
    return [idx, czech, word, pronunciation]

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
        tasks = [process_word(session, idx, word) for idx, word in enumerate(words, start=1)]
        results = await asyncio.gather(*tasks)

    # Filter out None results (in case of errors or missing data)
    results = [result for result in results if result is not None]

    # Write the results to the output CSV
    with open(output_path, "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(results)

# Run the main function
asyncio.run(main())
