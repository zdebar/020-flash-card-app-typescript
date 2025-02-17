import csv
import asyncio
import re
import pronouncing
from googletrans import Translator
from aiohttp import ClientSession

NUMBER_OF_WORDS = 200
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

translator = Translator()
semaphore = asyncio.Semaphore(5)  # Max 5 souběžných překladů

def clean_word(word):
    return re.sub(r'[^a-zA-Z0-9]', '', word)

def arpabet_to_ipa_conversion(arpabet_str):
    if arpabet_str is None:
        return "N/A"
    
    ipa_words = [arpabet_to_ipa.get(word, word) for word in arpabet_str.split()]
    return "/" + ''.join(ipa_words) + "/"

def get_pronunciation(word):
    phones = pronouncing.phones_for_word(word)
    return phones[0] if phones else None

async def translate_word(session, word):
    async with semaphore:  # Omezí počet souběžných požadavků
        try:
            czech = await asyncio.to_thread(translator.translate, word, src='en', dest='cs')
            await asyncio.sleep(0.2)  # Ochrana proti blokaci
            return czech.text.lower()
        except Exception as e:
            print(f"Chyba při překladu {word}: {e}")
            return "N/A"

async def process_words():
    words = []
    with open('./ngram_freq.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(words) >= NUMBER_OF_WORDS:
                break
            if row: 
                word = clean_word(row[0].lower())
                if len(word) > 1:  # Přeskakujeme jednopísmenná slova
                    words.append(word)

    async with ClientSession() as session:
        translations = await asyncio.gather(*(translate_word(session, word) for word in words))

    with open("CZ-EN.csv", "w", newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["id", "word", "translation", "pronunciation"]) 
        for idx, (word, czech) in enumerate(zip(words, translations), start=1):
            pronunciation = arpabet_to_ipa_conversion(get_pronunciation(word))
            writer.writerow([idx, word, czech, pronunciation])

    print("CSV successfully created.")

asyncio.run(process_words())
