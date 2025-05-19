import csv
from collections import defaultdict

input_path = 'items_202505181556.csv'
output_path = 'homographs_grouped.csv'

# Načtení dat a seskupení podle english
groups = defaultdict(list)
with open(input_path, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        english = row['english'].strip().lower()
        czech = row['czech'].strip()
        if english and czech:
            groups[english].append(row)

# Uložení skupin, kde je více různých českých významů
with open(output_path, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['ids', 'englishs', 'czechs', 'pronunciations'])
    for english, rows in groups.items():
        czechs = set(row['czech'] for row in rows)
        if len(czechs) > 1:
            writer.writerow([
                ','.join(row['id'] for row in rows),
                ','.join(row['english'] for row in rows),
                ','.join(row['czech'] for row in rows),
                ','.join(row['pronunciation'] for row in rows)
            ])