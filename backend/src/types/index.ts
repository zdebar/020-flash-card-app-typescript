export interface WordData {
  word_id: number;
  src: string | null;
  trg: string | null;
  prn: string | null;
  progress: number;
  next_at: Date | null;
}