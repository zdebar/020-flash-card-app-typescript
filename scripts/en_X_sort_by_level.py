import os
import pandas as pd

# Specify the folder containing the CSV files
folder_path = '../data/en-source/output'  # Change this to your folder path

# List to store dataframes
dataframes = []

# Iterate through all files in the folder
print(f"Reading CSV files from {folder_path}...")
for file_name in os.listdir(folder_path):
    if file_name.endswith('.csv'):
        file_path = os.path.join(folder_path, file_name)
        df = pd.read_csv(file_path)
        dataframes.append(df)

# Concatenate all dataframes into one
merged_df = pd.concat(dataframes, ignore_index=True)

# Sort the merged dataframe by the 4th column (index 3)
merged_df = merged_df.sort_values(by=merged_df.columns[3])

# Save the merged and sorted dataframe to a new CSV file
output_file = 'merged_sorted.csv'
merged_df.to_csv(output_file, index=False)

print(f"Merged and sorted CSV saved to {output_file}")