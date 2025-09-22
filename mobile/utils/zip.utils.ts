import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive";

const AUDIO_DIR = `${FileSystem.documentDirectory}audio/`;

/**
 * Ensures the audio directory exists.
 */
async function ensureAudioDirectoryExists() {
  const dirInfo = await FileSystem.getInfoAsync(AUDIO_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(AUDIO_DIR, { intermediates: true });
  }
}

/**
 * Downloads a ZIP file and saves it locally.
 */
async function downloadZipFile(zipUrl: string) {
  const zipPath = `${AUDIO_DIR}english.zip`;

  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      zipUrl,
      zipPath
    );
    const { uri } = await downloadResumable.downloadAsync();
    console.log(`Downloaded ZIP file: ${uri}`);
    return uri;
  } catch (error) {
    console.error("Failed to download ZIP file:", error);
    throw error;
  }
}

/**
 * Extracts a ZIP file to the audio directory.
 */
async function extractZipFile(zipPath: string) {
  try {
    const extractedPath = await unzip(zipPath, AUDIO_DIR);
    console.log(`Extracted ZIP file to: ${extractedPath}`);
    return extractedPath;
  } catch (error) {
    console.error("Failed to extract ZIP file:", error);
    throw error;
  }
}

/**
 * Deletes the ZIP file after extraction.
 */
async function deleteZipFile(zipPath: string) {
  try {
    await FileSystem.deleteAsync(zipPath);
    console.log(`Deleted ZIP file: ${zipPath}`);
  } catch (error) {
    console.error("Failed to delete ZIP file:", error);
  }
}

/**
 * Downloads and extracts the English audio ZIP file.
 */
export async function setupEnglishAudio(zipUrl: string) {
  await ensureAudioDirectoryExists();

  try {
    // Step 1: Download the ZIP file
    const zipPath = await downloadZipFile(zipUrl);

    // Step 2: Extract the ZIP file
    await extractZipFile(zipPath);

    // Step 3: Delete the ZIP file
    await deleteZipFile(zipPath);

    console.log("English audio setup complete!");
  } catch (error) {
    console.error("Failed to set up English audio:", error);
  }
}
