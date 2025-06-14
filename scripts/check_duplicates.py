import csv
from collections import defaultdict


def check_duplicates(file_path: str):
    """
    Check for duplicate entries in a CSV file based on 'english' and 'czech' columns.

    :param file_path: Path to the CSV file.
    """
    duplicates = defaultdict(list)
    seen = set()

    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        for line_number, row in enumerate(reader, start=1):
            if len(row) < 2:
                continue  # Skip rows with insufficient columns
            english, czech = row[0].strip(), row[1].strip()
            key = (english.lower(), czech.lower())
            if key in seen:
                duplicates[key].append(line_number)
            else:
                seen.add(key)

    if duplicates:
        print("Duplicate entries found:")
        for (english, czech), lines in duplicates.items():
            print(f"'{english}' - '{czech}' on lines: {lines}")
    else:
        print("No duplicate entries found.")

# Example usage
if __name__ == "__main__":
    file_path = r"d:/Active/020-flash-card-app-typescript/data/en-source/blocks/04_předložky/01_předložky.csv"
    check_duplicates(file_path)