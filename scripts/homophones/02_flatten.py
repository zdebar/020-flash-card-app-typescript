import csv

input_path = 'homophones_grouped.csv'
output_flattened = 'homophones_flattened.csv'
output_blocks = 'homophones_blocks.csv'

with open(input_path, encoding='utf-8') as infile, \
     open(output_flattened, 'w', encoding='utf-8', newline='') as flat_out, \
     open(output_blocks, 'w', encoding='utf-8', newline='') as blocks_out:

    reader = csv.DictReader(infile)
    flat_writer = csv.writer(flat_out)
    blocks_writer = csv.writer(blocks_out)

    flat_writer.writerow(['block_id', 'item_id'])
    blocks_writer.writerow(['block_id', 'block_name'])

    block_id = 1000
    for row in reader:
        pronunciation = row['pronunciation']
        ids = row['ids'].replace('"', '').split(',')

        # Write block_id and block_name (pronunciation) to blocks file
        blocks_writer.writerow([block_id, pronunciation])

        # Write block_id and each item_id to flattened file
        for item_id in ids:
            flat_writer.writerow([block_id, item_id.strip()])

        block_id += 1