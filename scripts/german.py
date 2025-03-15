import pandas as pd
from helpers import get_IPA_pronunciation

def process_xlsx_to_csv(input_file: str, output_file: str) -> None:
    xlsx = pd.ExcelFile(input_file)
    data = []

    for sheet_name in xlsx.sheet_names:
        df = pd.read_excel(input_file, sheet_name=sheet_name, usecols=[0, 1], header=None, names=["trg", "src"])
        df["src"] = df["src"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
        df["trg"] = df["trg"].apply(lambda x: str(x).strip() if isinstance(x, str) else "")
        df = df.dropna(subset=["src", "trg"])
        df = df[(df["src"] != "") & (df["trg"] != "")]
        df["prn"] = df["trg"].apply(lambda x: get_IPA_pronunciation(x.replace(",", ""), "de"))
        data.append(df)

    final_df = pd.concat(data, ignore_index=True)
    final_df.to_csv(output_file, index=False)

input_file = '../data/de-source/German_Vocab.xlsx'
output_file = '../data/de-source/CZ-DE.csv'
process_xlsx_to_csv(input_file, output_file)






