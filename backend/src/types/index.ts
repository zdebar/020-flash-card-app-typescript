export interface WordData {
  word_id: number;
  src: string | null;
  trg: string | null;
  prn: string | null;
  progress: number | null;
  next_at: Date | null;
}