import { Word, WordNew } from "./dataTypes";

/**
 * Converts new words to full Word format.
 * @param rows 
 * @returns 
 */
export function mapNewWordsToWordData(rows: WordNew[]): Word[] {
  return rows.map((row: WordNew) => ({
    id: row.id,
    src: row.src,
    trg: row.trg,
    prn: row.prn || null,
    audio: row.audio || null,
    progress: 0,
  }));
}