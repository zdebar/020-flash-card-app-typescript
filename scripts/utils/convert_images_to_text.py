import pytesseract
from PIL import Image
import os

# Function to convert images to text using Tesseract
def convert_images_to_text(input_directory: str, output_directory: str, lang: str = "ces+spa", custom_config: str = "--oem 3 --psm 6"):
    # Set the path to the Tesseract executable
    pytesseract.pytesseract.tesseract_cmd = r'D:\Program Files\Tesseract-OCR\tesseract.exe'

    # Ensure the output directory exists
    os.makedirs(output_directory, exist_ok=True)

    # Loop through all files in the input directory
    for filename in os.listdir(input_directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):  # Check for image files
            image_path = os.path.join(input_directory, filename)
            image = Image.open(image_path)

            # Extract text from image
            text = pytesseract.image_to_string(image, lang=lang, config=custom_config)

            # Define output text file path
            output_file = os.path.join(output_directory, f"{os.path.splitext(filename)[0]}.txt")

            # Write extracted text to a .txt file
            with open(output_file, "w", encoding="utf-8") as txt_file:
                txt_file.write(text)

    print("Processing complete.")

# This ensures that the script runs only when executed directly
if __name__ == "__main__":
    input_directory = "../data/es-source/"
    output_directory = "../data/es-source/text_output"
    convert_images_to_text(input_directory, output_directory)


