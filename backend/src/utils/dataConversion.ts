import { WordData } from "../types/dataTypes";

/**
 * Converts new words to full WordData format.
 * @param rows 
 * @returns 
 */
export function mapNewWordsToWordData(rows: any[]): WordData[] {
  return rows.map((row: any) => ({
    word_id: row.word_id,
    src: row.src,
    trg: row.trg,
    prn: row.prn || null,
    audio: row.audio || null,
    progress: row.progress || 0,
  }));
}