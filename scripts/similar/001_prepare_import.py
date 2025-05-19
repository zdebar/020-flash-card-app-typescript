import csv
import glob

# Najdi všechny soubory začínající grouped_similar_
input_files = glob.glob('grouped_similar_*.csv')

block_id_start = 2000
block_id = block_id_start

block_rows = []
block_item_rows = []

for filename in input_files:
    with open(filename, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 1. english_words, block_id, category_id
            block_rows.append([', '.join(row['english_words'].split(',')), block_id, 3])
            # 2. block_id, item_id (pro každé id ve skupině)
            for item_id in row['ids'].split(','):
                block_item_rows.append([block_id, item_id.strip()])
            block_id += 1

# Zápis výsledků
with open('similar_blocks.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['english_words', 'block_id', 'category_id'])
    writer.writerows(block_rows)

with open('similar_block_items.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['block_id', 'item_id'])
    writer.writerows(block_item_rows)