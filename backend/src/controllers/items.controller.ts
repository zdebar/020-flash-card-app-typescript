import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  UserScore,
  Item,
  BlockExplanation,
} from "../../../shared/types/dataTypes";
import {
  getItemsService,
  patchItemsService,
  getItemInfoService,
  resetItemService,
} from "../services/items.service";
import { getUserItemsListRepository } from "../repository/items.repository.postgres";
import { validationResult } from "express-validator";

/**
 * Controller function to retrieve user-specific practice words.
 */
export async function getItemsController(
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
    const languageID: number = parseInt((req as any).params.languageID, 10);

    const data: Item[] = await getItemsService(postgresDBPool, uid, languageID);

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
export async function patchItemsController(
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
      onBlockEnd,
    }: { items: Item[]; onBlockEnd: boolean; languageID: number } = req.body;
    const languageID: number = parseInt((req as any).params.languageID, 10);

    const score: UserScore[] = await patchItemsService(
      postgresDBPool,
      uid,
      items,
      onBlockEnd,
      languageID
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
export async function getInfoController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new Error(`Validation errors: ${JSON.stringify(errors.array())}`);
    }

    const itemID: number = parseInt((req as any).params.itemId, 10);

    const data: BlockExplanation[] = await getItemInfoService(
      postgresDBPool,
      itemID
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
    const languageID: number = parseInt((req as any).params.languageID, 10);

    const data: Item[] = await getUserItemsListRepository(
      postgresDBPool,
      uid,
      languageID
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
    const itemID: number = parseInt((req as any).params.itemID, 10);

    const score: UserScore[] = await resetItemService(
      postgresDBPool,
      uid,
      itemID
    );

    res.status(200).json({
      message: "User words retrieved successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}
