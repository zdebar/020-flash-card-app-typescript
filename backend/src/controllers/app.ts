import { trainingWordCount, trainingSessionCount, defaultScore, learningLanguage, baseProgress, baseRepetionProgress, overRepetionProgress } from "../config/config";
import { addUserWords, getNewWords, getUserWords, updateProgress, WordData } from "./database-utils";

/**
 * Return WordData
 * @param userID 
 * @param language 
 */

async function startTraining(userID: number, language: string): Promise<WordData[]> {
  try {
    const trainingWords = await getUserWords(userID, baseProgress, baseRepetionProgress - 1, language);
    const newWordsCount = trainingWordCount - trainingWords.length
    if (newWordsCount > 0) {
      const newWords = await getNewWords(userID, newWordsCount, language);
      addUserWords(userID, newWords);
      return newWords;
    }
    return trainingWords;
  } catch (err) {
    console.error(err);
  };  
};
