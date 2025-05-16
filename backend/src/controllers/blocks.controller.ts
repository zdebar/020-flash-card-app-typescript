import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { Block } from "../../../shared/types/dataTypes";
import { getGrammarListRepository } from "../repository/blocks.repository.postgres";

/**
 * Controller function to retrieve user-specific words based on source and target languages.
 *
 */
export async function getGrammarListController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;

    const blocks: Block[] = await getGrammarListRepository(postgresDBPool, uid);

    res.status(200).json({
      message: "Grammar list retrieved successfully.",
      blocks,
    });
  } catch (err) {
    next(err);
  }
}
