import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { BlockExplanation } from "../../../shared/types/dataTypes";
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
    const { languageID }: { languageID: number } = req.body;

    if (!languageID || typeof languageID !== "number") {
      throw new Error("Invalid languageID provided.");
    }

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
    (err as any).message = `Error in getGrammarListController: ${
      (err as any).message
    } | uid: ${(req as any).user.uid} | languageID: ${
      req.body.languageID || "undefined"
    }`;
    next(err);
  }
}
