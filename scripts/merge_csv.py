import os
import pandas as pd

# Define the folder containing CSV files and the output file
source_folder = os.path.abspath("data/de-source/csv_output")
output_file = os.path.abspath("data/de-source/csv_output/merged_file.csv")

# List all CSV files in the source folder
csv_files = [f for f in os.listdir(source_folder) if f.endswith(".csv")]

# Initialize an empty list to store dataframes
dataframes = []

# Loop through all CSV files and read them into dataframes
for filename in csv_files:
    input_path = os.path.join(source_folder, filename)
    df = pd.read_csv(input_path)
    
    # Append the dataframe to the list
    dataframes.append(df)

# Concatenate all dataframes into one
merged_df = pd.concat(dataframes, ignore_index=True)

# Add an 'id' column to the merged dataframe with sequential order
merged_df['id'] = range(1, len(merged_df) + 1)

# Reorder columns to make 'id' the first column
cols = ['id'] + [col for col in merged_df.columns if col != 'id']
merged_df = merged_df[cols]

# Save the merged dataframe to a new CSV file
merged_df.to_csv(output_file, index=False)

print(f"All CSV files have been merged and saved to {output_file}")

