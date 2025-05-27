import asyncio
import pandas as pd
import os
from typing import Union

# Function to save DataFrame to CSV
async def async_save_csv(df: pd.DataFrame, output_file: Union[str, bytes, os.PathLike[str]]) -> None:
    """Save a DataFrame to a CSV file asynchronously."""
    await asyncio.to_thread(df.to_csv, output_file, index=False)

async def async_read_excel(input_file: Union[str, bytes, os.PathLike[str]], sheet_name: str) -> pd.DataFrame:
    """Read the first two columns in an Excel sheet asynchronously and return a DataFrame with columns named 'trg' and 'src'."""
    return await asyncio.to_thread(
        pd.read_excel,
        input_file,
        sheet_name=sheet_name,
        usecols=[0, 1],
        header=None,
        names=["trg", "src"]
    )