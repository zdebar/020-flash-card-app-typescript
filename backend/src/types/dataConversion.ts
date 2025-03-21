import { WordData, WordDataNew } from "./dataTypes";

/**
 * Converts new words to full WordData format.
 * @param rows 
 * @returns 
 */
export function mapNewWordsToWordData(rows: WordDataNew[]): WordData[] {
  return rows.map((row: WordDataNew) => ({
    word_id: row.word_id,
    src: row.src,
    trg: row.trg,
    prn: row.prn || null,
    audio: row.audio || null,
    progress: 0,
  }));
}