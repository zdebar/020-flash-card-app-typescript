import csv

def load_words(file_path):
    """Load words from file2.csv into a set."""
    words = set()
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            # Assuming the word is in the first column
            words.add(row[0].strip().lower())
    return words

def check_sentences(file1_path, file2_path):
    """Check that all words in sentences from file1.csv are in file2.csv."""
    valid_words = load_words(file2_path)
    invalid_sentences = []

    with open(file1_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            sentence = row[0].strip()  # Assuming the sentence is in the first column
            words_in_sentence = sentence.lower().split()  # Split sentence into words
            for word in words_in_sentence:
                if word not in valid_words:
                    invalid_sentences.append(sentence)
                    break  # Stop checking this sentence if any word is invalid

    return invalid_sentences

def main():
    file1_path = 'file1.csv'  # Replace with the path to your file1.csv
    file2_path = 'file2.csv'  # Replace with the path to your file2.csv

    invalid_sentences = check_sentences(file1_path, file2_path)

    if invalid_sentences:
        print("Invalid sentences found:")
        for sentence in invalid_sentences:
            print(sentence)
    else:
        print("All sentences are valid.")

if __name__ == "__main__":
    main()