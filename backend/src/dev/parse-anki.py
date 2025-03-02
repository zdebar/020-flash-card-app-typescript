import csv
import re
import pronouncing

# For Converting TXT exported from ANKI Cards

regex = r"(.*?)-\s+\d+\s+-\s+\w+\s+(?:\d+\.\s+)?(.*?)(?=\d|,|$)"
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
    

def parse_file(file_path, output_csv):
    with open(file_path, 'r', encoding='utf-8') as file:
        # lines = [file.readline() for _ in range(10)] 
        lines = file.readlines()

    data = []

    for line in lines:
        if line.startswith("#"):
            continue
        match = re.match(regex, line.strip())
        if not match:
            print(line)

        if match:
            english = match.group(1).strip()
            czech = match.group(2).strip()
            # print(match.groups())
            pronunciation = arpabet_to_ipa_conversion(get_pronunciation(english))
            data.append([czech, english, pronunciation])

    # Zápis do CSV souboru
    with open(output_csv, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["id", "česky", "english", "pronunciation"])
        for idx, (czech, english, pronunciation) in enumerate(data, 1):
            writer.writerow([idx, czech, english, pronunciation])

    print(f"CSV soubor {output_csv} byl úspěšně vytvořen.")

input_file = 'English__Top 00001-05000.txt'  
output_csv = 'cz-en-5000-2.csv'  
parse_file(input_file, output_csv)
