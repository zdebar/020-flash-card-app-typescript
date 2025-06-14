

import pandas as pd

def remove_matching_rows(file1, file2, output_file):
    """
    Removes rows from the second file where both 'english' and 'czech' columns match rows in the first file.
    """
    # Read the first and second CSV files
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)

    # Remove rows from the second file where both 'english' and 'czech' match the first file
    filtered_df = df2[~((df2['english'].isin(df1['english'])) & (df2['czech'].isin(df1['czech'])))]
    
    # Save the filtered DataFrame to a new CSV file
    filtered_df.to_csv(output_file, index=False)

# Example usage
file2 = '../data/cz-en-basic-words.csv'  # Basic vocabulary file
file1 = '../data/prepared/000to009_DONE.csv' # New Grammar file
output_file = '../data/output_file.csv'   # Replace with the desired output file name
remove_matching_rows(file1, file2, output_file)

