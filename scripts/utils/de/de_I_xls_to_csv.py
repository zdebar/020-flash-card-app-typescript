import os
import pandas as pd
import asyncio
from utils.helpers import async_read_excel, async_save_csv
from utils.prepare_words import clean_DataFrame, replace_german_article


async def convert_xls_to_csv(sheet_name: str, input_file: str, output_folder: str) -> None:
    """
    Covert a single sheet from an Excel file to a CSV file.
    """
    # Read the Excel sheet into a DataFrame
    print(f"Processing sheet: {sheet_name}")
    df = await async_read_excel(input_file, sheet_name)

    # Strip whitespace from the DataFrame, drop empty rows
    df = clean_DataFrame(df)

    # Fix German articles
    df["trg"] = df["trg"].apply(replace_german_article)

    # Reorder columns
    final_df = df[["src", "trg"]]

    # Save the CSV file
    output_file = os.path.join(output_folder, f"{sheet_name}.csv")
    await async_save_csv(final_df, output_file)
    print(f"Saved CSV for sheet '{sheet_name}'.")

async def process_excel_sheets_to_csv(input_file: str, output_folder: str, sheet_index_start: int, sheet_index_end: int) -> None:
    """Process an Excel file and convert sheets to CSV files.

       sheet_index_start (int): INCLUSIVE
       sheet_index_end (int): EXCLUSIVE
    """
    os.makedirs(output_folder, exist_ok=True)

    xlsx = pd.ExcelFile(input_file)
    sheet_names = xlsx.sheet_names[sheet_index_start:sheet_index_end] 
    tasks = [convert_xls_to_csv(sheet_name, input_file, output_folder) for sheet_name in sheet_names]
    await asyncio.gather(*tasks)

    print("Processing complete.")

if __name__ == "__main__":

    # Convert xlsx to csv
    input_file = os.path.abspath("data/de-source/German_Vocab.xlsx")
    mid_folder = os.path.abspath("data/de-source/csv_output")
    sheet_index_start = 0 # Including
    sheet_index_end = 24  # Excluding   
    asyncio.run(process_excel_sheets_to_csv(input_file, mid_folder, sheet_index_start, sheet_index_end))



