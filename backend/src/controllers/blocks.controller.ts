import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { Block } from "../../../shared/types/dataTypes";
import { getGrammarListRepository } from "../repository/blocks.repository.postgres";

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
    const uid: string = (req as any).user.uid;

    const data: Block[] = await getGrammarListRepository(postgresDBPool, uid);

    res.status(200).json({
      message: "Grammar list retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}
