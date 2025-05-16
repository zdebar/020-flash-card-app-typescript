import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";
import {
  getItemsService,
  patchItemsService,
  getItemInfoService,
} from "../services/items.service";
import logger from "../utils/logger.utils";

/**
 * Controller function to retrieve user-specific words based on source and target languages.
 *
 */
export async function getItemsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;

    const items: Item[] = await getItemsService(postgresDBPool, uid);

    res.status(200).json({
      message: "User words retrieved successfully.",
      items,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the words associated with a user in the database. Sends back the updated score.
 */
export async function patchItemsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const { items, onBlockEnd }: { items: Item[]; onBlockEnd: boolean } =
      req.body;

    const score: UserScore = await patchItemsService(
      postgresDBPool,
      uid,
      items,
      onBlockEnd
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
    const itemId: number = parseInt((req as any).params.itemId, 10);

    const itemInfo: ItemInfo[] = await getItemInfoService(
      postgresDBPool,
      itemId
    );

    res.status(200).json({
      message: "Item info retrieved successfully.",
      itemInfo,
    });
  } catch (err) {
    next(err);
  }
}
