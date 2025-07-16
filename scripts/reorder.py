import os
import pandas as pd

def resequence_in_directory(directory):
    """
    Reorder the 'sequence' column in all CSV files within the specified directory.
    """
    # Get a list of all CSV files in the directory
    csv_files = [f for f in os.listdir(directory) if f.endswith('.csv')]

    for file in csv_files:
        input_file = os.path.join(directory, file)
        output_file = os.path.join(directory, f"reordered_{file}")

        # Load the CSV file
        df = pd.read_csv(input_file)

        # Recalculate the 'sequence' column starting from 1
        if 'sequence' in df.columns:
            df['sequence'] = range(1, len(df) + 1)
            # Save the updated DataFrame to a new CSV file
            df.to_csv(output_file, index=False)
            print(f"Reordered CSV saved to {output_file}")
        else:
            print(f"Column 'sequence' not found in {file}. Skipping.")

# Example usage
directory = '../data-spanish/import'  
resequence_in_directory(directory)