import requests
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def translate_to_czech_Google_Translate(text: str) -> str:
    """
    Translates a given text from English to Czech using the Google Translate API.

    Args:
        text (str): The text to translate.

    Returns:
        str: The translated text in Czech.
    """
    api_key = os.getenv("GOOGLE_TRANSLATE_API_KEY")
    if not api_key:
        raise Exception("GOOGLE_TRANSLATE_API_KEY is not set in the .env file.")

    url = "https://translation.googleapis.com/language/translate/v2"
    params = {
        "q": text,
        "source": "en",
        "target": "cs",
        "format": "text",
        "key": api_key
    }

    response = requests.post(url, data=params)
    response_data = response.json()

    if response.status_code == 200 and "data" in response_data:
        return response_data["data"]["translations"][0]["translatedText"]
    else:
        error_message = response_data.get("error", {}).get("message", "Unknown error")
        raise Exception(f"Translation API error: {error_message}")


