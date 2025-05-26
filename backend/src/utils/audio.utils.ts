import fs from "fs";

export function extractPhonemes(textGrid: string): string[] {
  const phonemeTier = textGrid.split('name = "phones"')[1];
  const intervals = phonemeTier.match(/text = "(.*?)"/g) || [];
  return intervals.map((interval) => interval.replace(/text = "|"/g, ""));
}

export function comparePhonemes(
  aligned: string[],
  expected: string[]
): number[] {
  const similarity: number[] = [];
  const maxLength = Math.max(aligned.length, expected.length);

  for (let i = 0; i < maxLength; i++) {
    if (aligned[i] === expected[i]) {
      similarity.push(1); // Exact match
    } else if (aligned[i] && expected[i]) {
      similarity.push(0.5); // Partial match (you can refine this logic)
    } else {
      similarity.push(0); // No match
    }
  }

  return similarity;
}
