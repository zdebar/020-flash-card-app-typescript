import csv
from typing import List

def compare_csv_files(file1: str, file2: str) -> List[str]:
    """
    Compare rows from two CSV files based on "english" and "czech" columns.
    Logs matches and returns a list of IDs for matching rows from the first file.

    :param file1: Path to the first CSV file (must include "id", "english", "czech" columns).
    :param file2: Path to the second CSV file (must include "english" and "czech" columns).
    :return: List of IDs from the first file for matching rows.
    """
    matches = []
    file1_data = []

    # Read the first file
    with open(file1, mode="r", encoding="utf-8") as f1:
        reader = csv.DictReader(f1)
        for row in reader:
            file1_data.append(row)

    # Read the second file and compare
    with open(file2, mode="r", encoding="utf-8") as f2:
        reader = csv.DictReader(f2)
        for row2 in reader:
            for row1 in file1_data:
                 if row1["english"].lower() == row2["english"].lower() and row1["czech"].lower() == row2["czech"].lower():
                    matches.append(row1["id"])

    return matches

# Example usage
if __name__ == "__main__":
    file1_path = "./export/database_export.csv"  # Replace with the path to your first CSV file
    file2_path = "../data/en-source/grammar/001_dny_v_tydnu_DONE.csv"  # Replace with the path to your second CSV file

    matching_ids = compare_csv_files(file1_path, file2_path)
    print("Matching IDs:", matching_ids)