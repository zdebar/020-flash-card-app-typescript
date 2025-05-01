import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  WordProgress,
  UserScore,
  Word,
  GrammarProgress,
  GrammarLecture,
  PronunciationItem,
  PronunciationLecture,
} from "../../../shared/types/dataTypes";
import {
  getWordsService,
  updateWordsService,
  getGrammarService,
  getPronunciationService,
  updateGrammarService,
} from "../services/practice.service";
import { getPronunciationListRepository } from "../repository/practice.repository.postgres";

/**
 * Controller function to retrieve user-specific words based on source and target languages.
 *
 */
export async function getWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const words: Word[] = await getWordsService(postgresDBPool, uid);

    res.status(200).json({
      message: "User words retrieved successfully.",
      words,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the words associated with a user in the database. Sends back the updated score.
 */
export async function updateWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const words: WordProgress[] = req.body;

    const score: UserScore = await updateWordsService(
      postgresDBPool,
      uid,
      words
    );

    res.status(200).json({
      message: "User words updated successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the grammar lecture for a user. If no lecture is found, returns null.
 */
export async function getGrammarController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;

    const grammar: GrammarLecture | null = await getGrammarService(
      postgresDBPool,
      uid
    );

    res.status(200).json({
      message: "User grammar lecture retrieved successfully.",
      grammar,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the lecture grammar progress for a user in the database. Sends back the updated user score.
 */
export async function updateGrammarController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const progress: GrammarProgress = req.body;

    const score: UserScore = await updateGrammarService(
      postgresDBPool,
      uid,
      progress
    );

    res.status(200).json({
      message: "User grammar lecture updated successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a list of pronunciation lectures from the database.
 */
export async function getPronunciationListController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const list: PronunciationItem[] = await getPronunciationListRepository(
      postgresDBPool
    );

    res.status(200).json({
      message: "Pronunciation list retrieved successfully.",
      list,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a specific pronunciation lecture based on the block ID.
 */
export async function getPronunciationController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const block_id: number = req.body; // should this be a query parameter instead?
    const pronunciation: PronunciationLecture = await getPronunciationService(
      postgresDBPool,
      block_id
    );

    res.status(200).json({
      message: "Pronunciation lecture retrieved successfully.",
      pronunciation,
    });
  } catch (err) {
    next(err);
  }
}
