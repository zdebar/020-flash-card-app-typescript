import requests
from googletrans import Translator

def translate_to_czech(text: str, api_key: str) -> str:
    """
    Translates a given text from English to Czech using the Google Translate API.

    Args:
        text (str): The text to translate.
        api_key (str): Your Google Cloud API key.

    Returns:
        str: The translated text in Czech.
    """
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

def translate_to_czech_no_api_key(text: str) -> str:
    """
    Translates a given text from English to Czech using the googletrans library.

    Args:
        text (str): The text to translate.

    Returns:
        str: The translated text in Czech.
    """
    translator = Translator()
    translation = translator.translate(text, src='en', dest='cs')
    return translation.text

