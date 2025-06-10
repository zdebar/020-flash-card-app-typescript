"""
Insertion script for Supabase database.
"""

import os
import csv
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Path to the folder containing CSV files
CSV_FOLDER_PATH = "../data/import/"

# Insert items into the `items` table and `block_items` table
def insert_items():
    for file_name in os.listdir(CSV_FOLDER_PATH):
        if file_name.endswith(".csv"):
            block_id = int(file_name.split("_")[0])  # Extract block number from file name
            file_path = os.path.join(CSV_FOLDER_PATH, file_name)

            with open(file_path, mode="r", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                for row in reader:
                    # Insert into `items` table
                    item_data = {
                        "english": row["english"],
                        "czech": row["czech"],
                        "pronunciation": row["pronunciation"],
                        "audio": row["audio"],
                        "item_order": int(row["item_order"]),
                    }
                    response = supabase.table("items").insert(item_data).execute()
                    item_id = response.data[0]["id"]

                    # Insert into `block_items` table
                    block_item_data = {
                        "item_id": item_id,
                        "block_id": block_id,
                    }
                    supabase.table("block_items").insert(block_item_data).execute()

            print(f"Successfully processed file: {file_name}")

if __name__ == "__main__":
    insert_items()