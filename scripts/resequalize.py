import pandas as pd
import os

def process_csv(input_file, output_file):
    # Print the input file path
    print(f"Input file path: {os.path.abspath(input_file)}")

    try:
        # Load the CSV file into a DataFrame
        df = pd.read_csv(input_file)
    except FileNotFoundError:
        # If the file does not exist, create an empty DataFrame
        print("Input file not found. Creating a new file.")
        df = pd.DataFrame()

    # Add 'language_id' column with all values set to 1
    df['language_id'] = 1

    # Add 'sequence' column with incremental values starting from 1
    df['sequence'] = range(1, len(df) + 1)

    # Save the updated DataFrame back to a CSV file
    df.to_csv(output_file, index=False)

    # Print the output file path
    print(f"Output file path: {os.path.abspath(output_file)}")

# Example usage
process_csv('../data/en-source/output/CZ-EN.csv', '../data/en-source/output/CZ-EN_1000.csv')
