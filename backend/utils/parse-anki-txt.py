import csv
import re

def parse_file(file_path, output_csv):
    with open(file_path, 'r', encoding='utf-8') as file:
        lines = [file.readline() for _ in range(3)]

    data = []

    for line in lines:
        if line.startswith("#"):
            continue
        match = re.match(r"(\w+)\s+-\s+(\d+)\s+-\s+(\w+)\s+(\d+).\s+(\w+)(.+)", line.strip())
        if match:
            english = match.group(1).strip()
            czech = match.group(5).strip()
            data.append([czech, english])

    with open(output_csv, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["id", "english", "česky"]) 
        for idx, (english, meaning) in enumerate(data, 1):
            writer.writerow([idx, english, meaning])

    print(f"CSV soubor {output_csv} byl úspěšně vytvořen.")

input_file = 'English__Top 00001-05000.txt'  
output_csv = 'cz-en-5000.csv'  
parse_file(input_file, output_csv)
