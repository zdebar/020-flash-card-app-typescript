import csv
from collections import defaultdict


def remove_duplicates(file_path: str, output_file: str):
    """
    Remove duplicate entries in a CSV file based on 'english' and 'czech' columns,
    keeping only the first instance.

    :param file_path: Path to the input CSV file.
    :param output_file: Path to the output CSV file.
    """
    seen = set()
    unique_rows = []

    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        header = next(reader)  # Read the header row
        unique_rows.append(header)  # Keep the header

        for row in reader:
            if len(row) < 2:
                continue  # Skip rows with insufficient columns
            english, czech = row[0].strip(), row[1].strip()
            key = (english.lower(), czech.lower())
            if key not in seen:
                seen.add(key)
                unique_rows.append(row)

    # Write the unique rows to the output file
    with open(output_file, mode="w", encoding="utf-8", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(unique_rows)

    print(f"Duplicates removed. Cleaned file saved to: {output_file}")

# Example usage
if __name__ == "__main__":
    input_file = r"D:/Active/020-flash-card-app-typescript/data/basic_vocabulary.csv"
    output_file = r"D:/Active/020-flash-card-app-typescript/data/cleaned_vocabulary.csv"
    remove_duplicates(input_file, output_file)