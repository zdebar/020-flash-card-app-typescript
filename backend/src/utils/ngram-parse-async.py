import asyncio
import aiohttp
import csv
import re
from pathlib import Path
import subprocess
from typing import Optional

folder_path = Path(r"D:/Active/020-flash-card-app-typescript/backend/data/en-source")
input_path = folder_path / "ngram_freq.csv"
output_path = folder_path / "CZ-EN.csv"

NUMBER_OF_WORDS = 200
GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"
ACCENT = "en-gb"  # en-gb for british, en-us for american

def clean_word(word: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]', '', word)

async def get_pronunciation(word: str, accent: str = ACCENT) -> Optional[str]:
    result = subprocess.run(
        ["espeak-ng", "-q", "--ipa", "-v", accent, word],
        capture_output=True, text=True
    )
    return result.stdout.strip() if result.stdout else None

async def translate_word(session: any, word: str) -> str:
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

async def process_word(session: any, idx: int, word: str) -> Optional[list]:
    czech = await translate_word(session, word)
    # pronunciation = await get_pronunciation(word)
    pronunciation = None
    return [idx, czech, word, pronunciation]

async def main():
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

    results = [result for result in results if result is not None]

    with open(output_path, "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(results)

asyncio.run(main())
