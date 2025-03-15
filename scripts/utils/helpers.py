import asyncio
import subprocess
import re

def clean_word(word: str) -> str:
    """
    Removes non-alphanumeric characters from the word.
    """
    return re.sub(r'[^a-zA-Z0-9]', '', word)

async def get_IPA_pronunciation(word: str, accent: str) -> str | None:
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
    result = await asyncio.create_subprocess_exec(
        espeak_ng_path, "-q", "--ipa", "-v", accent, word,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await result.communicate()
    
    # Decode the output and return
    return stdout.decode('utf-8').strip() if stdout else None

