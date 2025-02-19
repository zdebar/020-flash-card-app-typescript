import asyncio
import aiohttp
import csv
import re
import pronouncing

NUMBER_OF_WORDS = 100
GOOGLE_TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single"
input_path = '../../data/en-source/ngram_freq.csv'

arpabet_to_ipa = {
  "AA": "ɑ",
  "AE": "æ",
  "AH": "ʌ",
  "AO": "ɔ",
  "AW": "aʊ",
  "AY": "aɪ",
  "EH": "ɛ",
  "ER": "ɝ",
  "EY": "eɪ",
  "IH": "ɪ",
  "IY": "i",
  "OW": "oʊ",
  "OY": "ɔɪ",
  "UH": "ʊ",
  "UW": "u",
  "B": "b",
  "CH": "tʃ",
  "D": "d",
  "DH": "ð",
  "F": "f",
  "G": "g",
  "HH": "h",
  "JH": "dʒ",
  "K": "k",
  "L": "l",
  "M": "m",
  "N": "n",
  "NG": "ŋ",
  "P": "p",
  "R": "ɹ",
  "S": "s",
  "SH": "ʃ",
  "T": "t",
  "TH": "θ",
  "V": "v",
  "W": "w",
  "Y": "j",
  "Z": "z",
  "ZH": "ʒ"
}


def clean_word(word):
    return re.sub(r'[^a-zA-Z0-9]', '', word)

def arpabet_to_ipa_conversion(arpabet_str):
    if arpabet_str is None:
        return "N/A"
    
    arpabet_words = arpabet_str.split()
    arpabet_words = [re.sub(r'\d', '', word) for word in arpabet_words]
    
    ipa_words = [arpabet_to_ipa.get(word, word) for word in arpabet_words]
    return "/" + ''.join(ipa_words) + "/"

async def get_pronunciation(word):
    phones = pronouncing.phones_for_word(word)
    return phones[0] if phones else None

async def translate_word(session, word):
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
            return data[0][0][0].lower() if data else "N/A"
    except Exception as e:
        print(f"Error translating word {word}: {e}")
        return "N/A"

async def process_word(session, idx, word):
    czech = await translate_word(session, word)
    if czech != word:
        pronunciation = await get_pronunciation(word)
        if pronunciation is not None:
            pronunciation = arpabet_to_ipa_conversion(pronunciation)
            return [idx, czech, word, pronunciation]
    return None

async def main():
    words = []
    with open(input_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(words) >= NUMBER_OF_WORDS:
                break
            word = clean_word(row[0].lower())
            if len(word) > 1:
                words.append(word)

    async with aiohttp.ClientSession() as session:
        tasks = [process_word(session, idx, word) for idx, word in enumerate(words, start=1)]
        results = await asyncio.gather(*tasks)

    results = [result for result in results if result is not None]

    with open("CZ-EN.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(results)

    with open("EN.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for result in results:
            writer.writerow(result[2:3])

    with open("CZ.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        for result in results:
            writer.writerow(result[0:3])

asyncio.run(main())
