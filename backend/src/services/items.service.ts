import { PostgresClient } from "../types/dataTypes";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";
import {
  getItemsRepository,
  patchItemsRepository,
  getScoreRepository,
  getItemInfoRepository,
} from "../repository/items.repository.postgres";
import { extractPhonemes, comparePhonemes } from "../utils/audio.utils";
import { addAudioPath } from "../utils/update.utils";
import { promisify } from "util";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemsService(
  db: PostgresClient,
  uid: string
): Promise<Item[]> {
  const words: Item[] = await getItemsRepository(db, uid);
  return words.map((word) => ({
    ...word,
    audio: addAudioPath(word.audio),
  }));
}

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function patchItemsService(
  db: PostgresClient,
  uid: string,
  items: Item[],
  onBlockEnd: boolean
): Promise<UserScore> {
  await patchItemsRepository(db, uid, items, onBlockEnd);
  return await getScoreRepository(db, uid);
}

/**
 * Gets a list of words for a given user and language ID from the database.
 */
export async function getItemInfoService(
  db: PostgresClient,
  itemId: number
): Promise<ItemInfo[]> {
  const itemInfo: ItemInfo[] = await getItemInfoRepository(db, itemId);

  if (!itemInfo || itemInfo.length === 0) {
    throw new Error(`No item info found for itemId: ${itemId}`);
  }

  return itemInfo.map((item) => ({
    ...item,
    items:
      item.items?.map((word) => ({
        ...word,
        audio: addAudioPath(word.audio),
      })) || [],
  }));
}

export async function processPronunciationWithIPA(
  audioBuffer: Buffer,
  englishText: string,
  ipaText: string
): Promise<number[]> {
  // Paths for dictionary and model
  const dictionaryPath = path.join(
    __dirname,
    "../resources/dictionary/english_us_arpa.dict"
  );
  const modelPath = path.join(__dirname, "../resources/models/english");

  // Temporary paths
  const workDir = "/dev/shm";
  const audioPath = path.join(workDir, "audio.wav");
  const textPath = path.join(workDir, "audio.txt");
  const outputDir = path.join(workDir, "output");

  // Write files
  fs.writeFileSync(audioPath, audioBuffer);
  fs.writeFileSync(textPath, englishText);
  fs.mkdirSync(outputDir, { recursive: true });

  // Run MFA
  const mfaCmd = `mfa align ${workDir} ${dictionaryPath} ${modelPath} ${outputDir}`;
  await execAsync(mfaCmd);

  // Read TextGrid
  const textGridPath = path.join(outputDir, "audio.TextGrid");
  const textGrid = fs.readFileSync(textGridPath, "utf-8");

  // Extract phonemes from TextGrid
  const alignedPhonemes = extractPhonemes(textGrid);

  // Compare with IPA
  const ipaPhonemes = ipaText.split(" ");
  const similarity = comparePhonemes(alignedPhonemes, ipaPhonemes);

  // Cleanup
  fs.unlinkSync(audioPath);
  fs.unlinkSync(textPath);
  fs.rmdirSync(outputDir, { recursive: true });

  return similarity;
}
