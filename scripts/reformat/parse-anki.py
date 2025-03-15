import csv
import re
import pronouncing

# For Converting TXT exported from ANKI Cards

regex = r"(.*?)-\s+\d+\s+-\s+\w+\s+(?:\d+\.\s+)?(.*?)(?=\d|,|$)"

def parse_file(file_path, output_csv):
    """
    Parse Anki Card File
    """
    with open(file_path, 'r', encoding='utf-8') as file: 
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
            pronunciation = arpabet_to_ipa_conversion(get_english_pronunciation(english))
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
