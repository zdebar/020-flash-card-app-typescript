import csv

def copy_csv_rows(input_file: str, output_file: str):
    with open(input_file, 'r', newline='', encoding='utf-8') as infile, open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        # Copy the header
        header = next(reader)
        writer.writerow(header)

        # Copy the first 20,000 rows
        for i, row in enumerate(reader):
            if i >= 20000:
                break
            writer.writerow(row)

# Example usage
input_file = '../data/en-source/ngram_freq.csv'
output_file = 'output.csv'
copy_csv_rows('input.csv', 'output.csv')