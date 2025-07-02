import pandas as pd

def clean_csv(input_file, output_file):
    """
    Keeps only 'english' and 'czech' columns, ensuring 'english' is the first column.
    """
    # Read the input CSV file
    df = pd.read_csv(input_file)

    # Ensure the required columns exist
    if 'english' not in df.columns or 'czech' not in df.columns:
        raise ValueError("Input file must contain 'english' and 'czech' columns.")

    # Select only 'english' and 'czech' columns, with 'english' first
    cleaned_df = df[['english', 'czech']]

    # Save the cleaned DataFrame to a new CSV file
    cleaned_df.to_csv(output_file, index=False)

# Example usage
input_file = '../data/output_file.csv'  # Replace with your input file path
output_file = '../data/cleaned_file.csv'        # Replace with your desired output file path
clean_csv(input_file, output_file)