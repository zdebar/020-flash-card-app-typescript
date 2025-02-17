import csv
from googletrans import Translator
import re
import pronouncing

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

def clean_word(word):
    return re.sub(r'[^a-zA-Z0-9]', '', word)

def arpabet_to_ipa_conversion(arpabet_str):
    if arpabet_str is None:
        return "N/A"
    
    arpabet_words = arpabet_str.split()
    ipa_words = []
    for word in arpabet_words:
        if word in arpabet_to_ipa:
            ipa_words.append(arpabet_to_ipa[word])
        else:
            print(f"Neznámý foném: {word}")
            ipa_words.append(word)
    return "/" + ''.join(ipa_words) + "/"

def get_pronunciation(word):
    phones = pronouncing.phones_for_word(word)
    if phones:
        return phones[0]
    else:
        return None

words = []
with open('./ngram_freq.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        if len(words) >= NUMBER_OF_WORDS:  # Zastavíme se, když máme dostatek slov
            break
        if row: 
            word = clean_word(row[0].lower())
            if len(word) > 1:  # Přeskakujeme jednopísmenná slova
                words.append(word)

with open("CZ-EN.csv", "w", newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["id", "word", "translation", "pronunciation"]) 
    for idx, word in enumerate(words, start=1):
        try:
            czech = translator.translate(word, src='en', dest='cs').text.lower() 
        except:
            print(idx, word)
            czech = "N/A"
        pronunciation = arpabet_to_ipa_conversion(get_pronunciation(word))
        writer.writerow([idx, word, czech, pronunciation])

print("CSV successfully created.")
