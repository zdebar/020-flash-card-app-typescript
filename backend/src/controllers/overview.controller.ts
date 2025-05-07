import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { OverviewItem, OverviewGrammar } from "../../../shared/types/dataTypes";
import {
  getOverviewWordsService,
  getOverviewSentencesService,
} from "../services/overview.service";
import { getOverviewGrammarRepository } from "../repository/overview.repository.postgres";

/**
 * Get list of started words.
 */
export async function getOverviewWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const data: OverviewItem[] = await getOverviewWordsService(
      postgresDBPool,
      uid,
      limit,
      offset
    );

    res.status(200).json({
      message: "User words retrieved successfully.",
      data,
      pagination: {
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get list of started sentences.
 */
export async function getOverviewSentencesController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const data: OverviewItem[] = await getOverviewSentencesService(
      postgresDBPool,
      uid,
      limit,
      offset
    );

    res.status(200).json({
      message: "User sentences retrieved successfully.",
      data,
      pagination: {
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get list of started grammar lectures.
 */
export async function getOverviewGrammarController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const data: OverviewGrammar[] = await getOverviewGrammarRepository(
      postgresDBPool,
      uid,
      limit,
      offset
    );

    res.status(200).json({
      message: "User grammar retrieved successfully.",
      data,
      pagination: {
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
}
