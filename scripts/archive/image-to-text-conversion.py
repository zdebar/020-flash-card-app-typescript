import pytesseract
from PIL import Image
import os

pytesseract.pytesseract.tesseract_cmd = r'D:\Program Files\Tesseract-OCR\tesseract.exe'

# Converts img of page into parseable text

input_directory = "../data/es-source/"

for filename in os.listdir(input_directory):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        image_path = os.path.join(input_directory, filename)
        image = Image.open(image_path)

        custom_config = "--oem 3 --psm 6"
        text = pytesseract.image_to_string(image, lang="ces+spa", config=custom_config)

        output_file = os.path.join(input_directory, f"{os.path.splitext(filename)[0]}.txt")
        with open(output_file, "w", encoding="utf-8") as txt_file:
            txt_file.write(text)

print("Processing complete.")

