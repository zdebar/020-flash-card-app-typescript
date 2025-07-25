import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { BlockExplanation, UserScore } from "../../../shared/types/dataTypes";
import { getGrammarListRepository } from "../repository/blocks.repository.postgres";
import { validationResult } from "express-validator";
import { resetBlockService } from "../services/block.service";

/**
 * Controller function to retrieve list of grammar blocks.
 *
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
    const { languageID }: { languageID: number } = req.body;

    const data: BlockExplanation[] = await getGrammarListRepository(
      postgresDBPool,
      uid,
      languageID
    );

    res.status(200).json({
      message: "Grammar list retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

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
    const blockID: number = parseInt((req as any).params.blockID, 10);

    const score: UserScore[] = await resetBlockService(
      postgresDBPool,
      uid,
      blockID
    );

    res.status(200).json({
      message: "Block resetted successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}
