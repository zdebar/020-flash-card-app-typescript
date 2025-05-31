import pandas as pd

def process_csv(file_path):
    # Load the CSV file
    df = pd.read_csv(file_path, usecols=[0, 1], names=['Czech', 'English'])
    
    # Find rows where English text appears more than once
    duplicate_english = df[df['English'].duplicated(keep=False)]
    
    # Sort rows with the same English text next to each other
    sorted_duplicates = duplicate_english.sort_values(by='English')
    
    return sorted_duplicates

# Path to the CSV file
csv_file_path = '../data/en-source/output/cz-en-sequenced-audio.csv' 

# Process the CSV file
result = process_csv(csv_file_path)

# Display the result
print(result)

# Optionally, save the result to a new CSV file
result.to_csv('sorted_duplicates.csv', index=False)