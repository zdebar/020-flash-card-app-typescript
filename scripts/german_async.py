import os
import pandas as pd
import asyncio
from utils.helpers import get_IPA_pronunciation
from utils.helpers import generate_audio_for_words, async_save_csv

async def async_read_excel(input_file: str, sheet_name: str):
    return await asyncio.to_thread(pd.read_excel, input_file, sheet_name=sheet_name, usecols=[0, 1], header=None, names=["trg", "src"])

def clean_data(df):
    df["src"] = df["src"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
    df["trg"] = df["trg"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
    df = df.dropna(subset=["src", "trg"])
    df = df[(df["src"] != "") & (df["trg"] != "")]
    return df

def replace_german_article(word):
    if word.startswith("e "):
        return "die " + word[2:]
    elif word.startswith("r "):
        return "der " + word[2:]
    elif word.startswith("s "):
        return "das " + word[2:]
    return word

async def process_sheet(sheet_name, input_file, output_folder, audio_folder):
    print(f"Processing sheet: {sheet_name}")
    df = await async_read_excel(input_file, sheet_name)
    df = clean_data(df)

    # Fix german articles
    df["trg"] = df["trg"].apply(replace_german_article)

    # Get IPA pronunciation for each word
    prn_list = await asyncio.gather(
        *[get_IPA_pronunciation(word.replace(",", ""), "de") for word in df["trg"]]
    )
    df["prn"] = prn_list

    # Generate audio files for each word
    audio_files = await generate_audio_for_words(df, audio_folder, "de")
    df["audio"] = audio_files

    # Reorder columns
    final_df = df[["src", "trg", "prn", "audio"]]

    # Save the CSV file
    output_file = os.path.join(output_folder, f"{sheet_name}.csv")
    await async_save_csv(final_df, output_file)
    print(f"Saved CSV for sheet '{sheet_name}'.")

async def process_xlsx_to_csv(input_file: str, output_folder: str, audio_folder: str, sheet_index_start: int, sheet_index_end: int) -> None:
    os.makedirs(output_folder, exist_ok=True)
    os.makedirs(audio_folder, exist_ok=True)

    xlsx = pd.ExcelFile(input_file)
 
    sheet_names = xlsx.sheet_names[sheet_index_start:sheet_index_end] 
    tasks = [process_sheet(sheet_name, input_file, output_folder, audio_folder) for sheet_name in sheet_names]
    await asyncio.gather(*tasks)

    print("Processing complete.")

if __name__ == "__main__":
    input_file = os.path.abspath("data/de-source/German_Vocab.xlsx")
    output_folder = os.path.abspath("data/de-source/csv_output")
    audio_folder = os.path.abspath("data/de-source/audio-de")
    sheet_index_start = 0
    sheet_index_end = 2
    asyncio.run(process_xlsx_to_csv(input_file, output_folder, audio_folder, sheet_index_start, sheet_index_end))
