import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
import {
  getPracticeItemsService,
  updateUserPracticeService,
  getItemInfoService,
  resetItemService,
} from "../services/items.service";
import { getItemsListService } from "../services/items.service";
import { validationResult } from "express-validator";

/**
 * Controller function to retrieve user-specific practice words.
 */
export async function getPracticeController(
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

    const data: Item[] = await getPracticeItemsService(
      postgresDBPool,
      uid,
      languageId
    );

    res.status(200).json({
      message: "User words retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates practice user_items progress. Sends back the updated score.
 */
export async function patchPracticeController(
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
    const {
      items,
      onPracticeBlockEnd,
    }: { items: Item[]; onPracticeBlockEnd: boolean } = req.body;
    const languageId: number = parseInt((req as any).params.languageId, 10);

    const score: UserScore[] = await updateUserPracticeService(
      postgresDBPool,
      uid,
      items,
      onPracticeBlockEnd,
      languageId
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
 * Get context information for a specific item.
 */
export async function getItemInfoController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const itemId: number = parseInt((req as any).params.itemId, 10);

    const data: BlockExplanation[] = await getItemInfoService(
      postgresDBPool,
      itemId
    );

    res.status(200).json({
      message: "Item info retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller function to retrieve user-specific practice words.
 */
export async function getUserItemsListController(
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

    const data: Item[] = await getItemsListService(
      postgresDBPool,
      uid,
      languageId
    );

    res.status(200).json({
      message: "User words retrieved successfully.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller function to retrieve user-specific practice words.
 */
export async function resetItemController(
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
    const itemId: number = parseInt((req as any).params.itemId, 10);

    const score: UserScore[] = await resetItemService(
      postgresDBPool,
      uid,
      itemId
    );

    res.status(200).json({
      message: "User words retrieved successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}
