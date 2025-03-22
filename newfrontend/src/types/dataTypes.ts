export interface Word {
  word_id: number;
  src: string;
  trg: string;
  prn: string | null;
  audio: string | null;
  progress: number;
}

export interface JsonData {
  words: Word[];
}