import pytesseract
from PIL import Image
import os


def convert_images_to_text(input_directory: str, output_directory: str, lang: str = "ces+spa", custom_config: str = "--oem 3 --psm 6"):
    pytesseract.pytesseract.tesseract_cmd = r'D:\Program Files\Tesseract-OCR\tesseract.exe'

    os.makedirs(output_directory, exist_ok=True)

    for filename in os.listdir(input_directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(input_directory, filename)
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image, lang=lang, config=custom_config)
            output_file = os.path.join(output_directory, f"{os.path.splitext(filename)[0]}.txt")

            with open(output_file, "w", encoding="utf-8") as txt_file:
                txt_file.write(text)

    print("Converted images to txt for directory:" + output_directory)

if __name__ == "__main__":
    input_directory = "../data/es-source/"
    output_directory = "../data/es-source/text_output"
    convert_images_to_text(input_directory, output_directory)


