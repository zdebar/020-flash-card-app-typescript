import os
import pandas as pd

"""
Combines multiple CSV files from a specified directory into a single CSV file.
"""

def combine_csv_files(directory, output_file):
    # Get a list of all CSV files in the directory
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]
    
    # Sort the files to ensure they are combined in order
    csv_files.sort()

    combined_dataframes = []

    for file in csv_files:
        try:
            # Read each CSV file
            df = pd.read_csv(os.path.join(directory, file))
            combined_dataframes.append(df)
        except Exception as e:
            print(f"Error reading {file}: {e}")

    # Combine all valid DataFrames
    if combined_dataframes:
        combined_df = pd.concat(combined_dataframes)
        # Save the combined DataFrame to a new CSV file
        combined_df.to_csv(output_file, index=False)
        print(f"Combined CSV saved to {output_file}")
    else:
        print("No valid CSV files to combine.")

# Example usage
directory = '../data/imported'  # Replace with your directory path
output_file = '../data/imported/combined_output.csv'       # Replace with your desired output file name
combine_csv_files(directory, output_file)