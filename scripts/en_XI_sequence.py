import csv

# Input and output file paths
input_file = '../data/en-source/output/merged_sorted.csv'  # Replace with your input CSV file path
output_file = '../data/en-source/output/cz-en-sequenced.csv'  # Replace with your desired output CSV file path

# Read the input CSV and add new columns
with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames + ['language', 'seq']

    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        seq = 1
        for row in reader:
            row['language'] = 1
            row['seq'] = seq
            writer.writerow(row)
            seq += 1

print(f"New CSV with added columns saved to {output_file}")