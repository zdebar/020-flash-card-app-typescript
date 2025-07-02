import csv
from collections import Counter

def list_duplicate_english_words(file_path: str):
    """
    Print all duplicate English words from a CSV file.

    :param file_path: Path to the CSV file.
    """
    english_words = []

    # Read the CSV file
    with open(file_path, mode="r", encoding="utf-8") as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip the header row

        for row in reader:
            if len(row) < 1:
                continue  # Skip rows with insufficient columns
            english = row[0].strip()
            english_words.append(english.lower())

    # Count occurrences of each English word
    word_counts = Counter(english_words)

    # Find and print duplicates
    duplicates = {word: count for word, count in word_counts.items() if count > 1}

    if duplicates:
        print("Duplicate English words found:")
        for word, count in duplicates.items():
            print(f"'{word}' appears {count} times.")
    else:
        print("No duplicate English words found.")

# Example usage
if __name__ == "__main__":
    file_path = r"D:/Active/020-flash-card-app-typescript/data/cleaned_vocabulary.csv"
    list_duplicate_english_words(file_path)