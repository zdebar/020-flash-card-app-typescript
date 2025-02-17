import os
print("Current working directory:", os.getcwd())

def read_binary_file(file_path):
    encodings = ["utf-8", "utf-16", "latin-1", "ascii", "windows-1252", "mac_roman", "iso-8859-1"]
    n_characters = 1000
    
    with open(file_path, "rb") as f:
        data = f.read(n_characters)
        
        for enc in encodings:
            try:
                print(f"\nTrying encoding: {enc}\n")
                decoded_data = data.decode(enc)
                print(decoded_data) 
            except UnicodeDecodeError:
                print(f"Failed to decode using {enc}")
                continue
        else:
            print("\nNo encoding worked, showing raw hex dump:\n")
            print(data.hex()) 

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(script_dir, "dic.bin")
    print("Looking for file:", file_path)
    read_binary_file(file_path)