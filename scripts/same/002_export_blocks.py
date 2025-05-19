import csv
from collections import defaultdict

input_path = 'items_202505181556.csv'
blocks_path = 'homograph_blocks.csv'
block_items_path = 'homograph_block_items.csv'

# Načtení dat a seskupení podle english
groups = defaultdict(list)
with open(input_path, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        english = row['english'].strip().lower()
        czech = row['czech'].strip()
        if english and czech:
            groups[english].append(row)

# Najdi skupiny, kde je více různých českých významů
homograph_groups = []
for english, rows in groups.items():
    czechs = set(row['czech'] for row in rows)
    if len(czechs) > 1:
        homograph_groups.append(rows)

# Vytvoření bloků a block_items
block_id_start = 5000
block_id = block_id_start
blocks = []
block_items = []
for group in homograph_groups:
    english = group[0]['english']
    blocks.append([block_id, english, 5])  
    for row in group:
        block_items.append([block_id, row['id']])
    block_id += 1

with open(blocks_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['block_id', 'english', 'category_id'])
    writer.writerows(blocks)

with open(block_items_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['block_id', 'item_id'])
    writer.writerows(block_items)
