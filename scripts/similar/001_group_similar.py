import csv
from collections import defaultdict
from itertools import combinations

# Definice skupin zaměnitelných zvuků
sound_groups = [
    {'θ', 'ð', 't'},
    {'v', 'w'},
    {'ɛ', 'æ'},
]

def differ_by_one_group(pron1, pron2, group):
    if len(pron1) != len(pron2):
        return False
    diff_count = 0
    for a, b in zip(pron1, pron2):
        if a != b:
            if a in group and b in group:
                diff_count += 1
            else:
                return False
    return diff_count == 1

# Načtení dat
words = []
with open('items_202505181556.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if not row['pronunciation'].strip():
            continue
        words.append({
            'id': row['id'],
            'english': row['english'],
            'pronunciation': row['pronunciation']
        })

for group in sound_groups:
    group = set(group)
    # Najdeme všechny dvojice, které se liší právě v jednom znaku z group
    clusters = []
    used = set()
    for i, w1 in enumerate(words):
        if w1['id'] in used:
            continue
        cluster = [w1]
        for j, w2 in enumerate(words):
            if i == j or w2['id'] in used:
                continue
            if differ_by_one_group(w1['pronunciation'], w2['pronunciation'], group):
                cluster.append(w2)
                used.add(w2['id'])
        if len(cluster) > 1:
            for w in cluster:
                used.add(w['id'])
            clusters.append(cluster)

    # Uložení výsledku
    output = f'grouped_similar_{"_".join(sorted(group))}.csv'
    with open(output, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['ids', 'english_words', 'pronunciations'])
        for cluster in clusters:
            writer.writerow([
                ','.join(w['id'] for w in cluster),
                ','.join(w['english'] for w in cluster),
                ','.join(w['pronunciation'] for w in cluster)
            ])