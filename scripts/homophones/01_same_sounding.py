import csv
from collections import defaultdict

# Načtení dat
pron_dict = defaultdict(list)
with open('items_202505181556.csv', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        # Přeskočíme prázdnou výslovnost
        if not row['pronunciation'].strip():
            continue
        # Přeskočíme slova začínající velkým písmenem
        if row['english'] and row['english'][0].isupper():
            continue
        # Uložíme tuple (id, english)
        pron_dict[row['pronunciation']].append((row['id'], row['english']))

# Uložení výsledku
with open('homophones_grouped.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['pronunciation', 'ids'])
    for pron, id_eng_list in pron_dict.items():
        # Unikátní english hodnoty (case-insensitive), zachová první výskyt
        seen = set()
        filtered = []
        for id_, eng in id_eng_list:
            eng_lower = eng.lower()
            if eng_lower not in seen:
                seen.add(eng_lower)
                filtered.append((id_, eng))
        # Pokud jsou alespoň dvě různé english, vypíšeme všechny id
        if len(filtered) > 1:
            ids = [id_ for id_, _ in filtered]
            writer.writerow([pron, ','.join(ids)])