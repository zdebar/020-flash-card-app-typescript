import re
import pandas as pd

def removes_non_alpanumeric_chars(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

def replace_german_article(word: str) -> str:
    """Replace shorthand German articles with full forms.
    """
    if word.startswith("e "):
        return "die " + word[2:]
    elif word.startswith("r "):
        return "der " + word[2:]
    elif word.startswith("s "):
        return "das " + word[2:]
    return word

def prepare_german_word(word: str) -> str:
    """
    Prepares the German word by removing non-alphanumeric characters and replacing shorthand articles.
    """
    word = removes_non_alpanumeric_chars(word)
    return replace_german_article(word)

def clean_DataFrame(df: pd.DataFrame) -> pd.DataFrame:
    """Clean the DataFrame by removing empty rows and stripping whitespace from string values.
    """
    df = df.map(lambda x: str(x).strip() if isinstance(x, str) else x)
    df = df.dropna(how="all")    
    return df

def choose_british(df: pd.DataFrame) -> pd.DataFrame:
    """Choose British English words from the DataFrame.
    """
    df["trg"] = df["trg"].str.replace(r".*/", "", regex=True)  # Remove everything before and including "/"
    return df