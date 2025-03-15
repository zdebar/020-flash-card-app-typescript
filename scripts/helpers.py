import subprocess
import pronouncing
import re
from typing import List

def clean_word(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

def get_IPA_pronunciation(word: str, accent: str) -> str | None: # Should this be async?
    """
    Gets IPA pronunciation of the word using espeak-ng. Works with espeak_ng installed in predefined location.

    Args:
        word (str): source word
        accent (str): intended accent
            "en-gb": british english
            "en-us": us english
            "fr": french
            "de": german
            "es": spanish

    Returns:
        str: IPA transcription
    """
    espeak_ng_path = r"C:/Program Files/eSpeak NG/espeak-ng.exe"
    result = subprocess.run(
        [espeak_ng_path, "-q", "--ipa", "-v", accent, word],
        capture_output=True, text=True, encoding='utf-8'
    )
    return result.stdout.strip() if result.stdout else None
