import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { Item, Block } from "../../../shared/types/dataTypes";
import {
  getGrammarPhrasesRepository,
  getGrammarsRepository,
  getGrammarsCountRepository,
} from "../repository/blocks.repository.postgres";

/**
 * Get list of started grammar lectures.
 */
export async function getGrammarsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const blocks: Block[] = await getGrammarsRepository(
      postgresDBPool,
      uid,
      limit,
      offset
    );

    // Calculate total pages (assuming getGrammarsRepository can provide total count)
    const totalCount: number = await getGrammarsCountRepository(
      postgresDBPool,
      uid
    );
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "User grammar retrieved successfully.",
      data: blocks,
      pagination: {
        page,
        limit,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get list of started sentences.
 */
export async function getGrammarPhrasesController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const grammarId: number = parseInt((req as any).params.itemId, 10);
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const items: Item[] = await getGrammarPhrasesRepository(
      postgresDBPool,
      uid,
      grammarId,
      limit,
      offset
    );

    res.status(200).json({
      message: "User sentences retrieved successfully.",
      items,
      pagination: {
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}
