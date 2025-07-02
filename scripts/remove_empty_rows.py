import pandas as pd

def remove_empty_rows(input_file: str, output_file: str) -> None:
    """
    Removes rows with empty values in a CSV file and saves the cleaned file.
    """
    # Read the CSV file
    df = pd.read_csv(input_file)

    # Drop rows where all values are NaN or empty
    cleaned_df = df.dropna(how='all')

    # Save the cleaned DataFrame to a new CSV file
    cleaned_df.to_csv(output_file, index=False)

    print(f"Empty rows removed. Cleaned file saved to: {output_file}")

# Example usage
input_file = '../data/sorting.csv'  # Replace with your input file path
output_file = '../data/sorting2.csv'  # Replace with your desired output file path
remove_empty_rows(input_file, output_file)