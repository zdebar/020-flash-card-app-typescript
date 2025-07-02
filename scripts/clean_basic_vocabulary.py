import pandas as pd

def remove_matching_rows(file1, file2, output_file):
    """
    Removes rows from the second file where both 'english' and 'czech' columns match rows in the first file.
    Retains all columns from file2 in the output file.
    """
    # Read the first and second CSV files
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)

    # Ensure both files have the necessary columns
    if 'english' not in df1.columns or 'czech' not in df1.columns:
        raise ValueError("file1 must contain 'english' and 'czech' columns.")
    if 'english' not in df2.columns or 'czech' not in df2.columns:
        raise ValueError("file2 must contain 'english' and 'czech' columns.")

    # Perform an inner merge to find matching rows
    matching_rows = pd.merge(df2, df1, on=['english', 'czech'], how='inner')

# Filter out rows in df2 that are present in matching_rows
    filtered_df = df2[~df2.index.isin(matching_rows.index)]

    # Save the filtered DataFrame to a new CSV file
    filtered_df.to_csv(output_file, index=False)

# Example usage
file2 = '../data/prepared/base.csv'  # Base file
file1 = '../data/prepared/vocabulary.csv'  # Vocabulary file
output_file = '../data/output_file.csv'   # Replace with the desired output file name
remove_matching_rows(file1, file2, output_file)

