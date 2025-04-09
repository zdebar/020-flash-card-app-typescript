import asyncio
import pandas as pd

# Function to save DataFrame to CSV
async def async_save_csv(df, output_file):
    await asyncio.to_thread(df.to_csv, output_file, index=False)

async def async_read_excel(input_file: str, sheet_name: str) -> pd.DataFrame:
    """Read first two columns in Excel sheet asynchronously and returns a DataFrame with columns named "trg", "src".
    """
    return await asyncio.to_thread(pd.read_excel, input_file, sheet_name=sheet_name, usecols=[0, 1], header=None, names=["trg", "src"])
