from googletrans import Translator
import nltk
import re
from nltk.corpus import reuters
from nltk.probability import FreqDist
import csv

nltk.download('reuters')
nltk.download('punkt')

# Inicializace překladače
translator = Translator()

# Funkce pro čištění slov
def clean_word(word):
    return re.sub(r'[^a-zA-Z0-9]', '', word)

# Načteme slova z Reuters korpusu a vyčistíme je
words = [clean_word(word.lower()) for word in reuters.words()]
words = [word for word in words if len(word) > 1]

# Spočítáme frekvence a získáme 50 nejčastějších slov
freq_dist = FreqDist(words)
top_50 = list(freq_dist.keys())[:50]

# Uložení výsledků do CSV souboru
with open("top_50_words_with_translation.csv", "w", newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["id", "word", "translation"])  # Záhlaví CSV
    for idx, word in enumerate(top_50, start=1):
        translation = translator.translate(word, src='en', dest='cs').text.lower()  # Překlad do češtiny
        writer.writerow([idx, word, translation])

print("Seznam 50 slov s překladem byl úspěšně uložen do souboru 'top_50_words_with_translation.csv'.")

