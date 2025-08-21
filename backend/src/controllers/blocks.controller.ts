import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { BlockExplanation, UserScore } from "../../../shared/types/dataTypes";
import { getGrammarListRepository } from "../repository/blocks.repository.postgres";
import { validationResult } from "express-validator";
import { resetBlockService } from "../services/block.service";

/**
 * Controller function to retrieve list of unlocked grammar blocks.
 */
export async function getGrammarListController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const uid: string = (req as any).user.uid;
    const languageId: number = parseInt((req as any).params.languageId, 10);

    const data: BlockExplanation[] = await getGrammarListRepository(
      postgresDBPool,
      uid,
      languageId,
      1 // categoryId == 1 for intiaal grammar blocks
    );

    res.status(200).json({
      message: "Grammar List retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller function to retrieve list of unlocked grammar practice blocks.
 */
export async function getGrammarPracticeListController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const uid: string = (req as any).user.uid;
    const languageId: number = parseInt((req as any).params.languageId, 10);

    const data: BlockExplanation[] = await getGrammarListRepository(
      postgresDBPool,
      uid,
      languageId,
      2 // categoryId == 2 for grammar practice blocks
    );

    res.status(200).json({
      message: "Grammar Practice List retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Resets a specific block for the user. Will erase all corresponding user_items and return updated score.
 */
export async function resetBlockController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const uid: string = (req as any).user.uid;
    const blockId: number = parseInt((req as any).params.blockId, 10);

    const score: UserScore[] = await resetBlockService(
      postgresDBPool,
      uid,
      blockId
    );

    res.status(200).json({
      message: "Block reset successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}
