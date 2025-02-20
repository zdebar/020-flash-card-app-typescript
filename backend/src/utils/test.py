import subprocess

result = subprocess.run(
    ["espeak-ng", "-q", "--ipa", "-v", "en-us", "test"],
    capture_output=True, text=True
)
print(f"Espeak-ng output: {result.stdout}")
if result.returncode != 0:
    print(f"Espeak-ng failed with return code {result.returncode}")
