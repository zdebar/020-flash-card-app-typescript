import csv

# Define the phoneme to block_id mapping
phoneme_map = {
    'θ': 0,
    'ð': 1,
    'w': 2,
    'æ': 3
}

# Input and output file paths
input_csv = 'items_202505181556.csv'
output_csv = 'output_block_items.csv'

with open(input_csv, newline='', encoding='utf-8') as infile, open(output_csv, 'w', newline='', encoding='utf-8') as outfile:
    reader = csv.DictReader(infile)
    writer = csv.writer(outfile)
    writer.writerow(['block_id', 'item_id'])
    for row in reader:
        pronunciation = row.get('pronunciation', '')
        item_id = row.get('id', '')  # fix: use 'id' column for item_id
        for phoneme, block_id in phoneme_map.items():
            if phoneme in pronunciation:
                writer.writerow([block_id, item_id])
                break
