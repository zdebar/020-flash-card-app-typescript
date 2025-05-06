import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import {
  ItemProgress,
  UserScore,
  Item,
  ItemInfo,
} from "../../../shared/types/dataTypes";
import {
  getItemsService,
  updateItemsService,
} from "../services/practice.service";
import { getInfoRepository } from "../repository/practice.repository.postgres";

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
      items: items,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates the words associated with a user in the database. Sends back the updated score.
 */
export async function updateItemsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const items: ItemProgress[] = req.body;

    const score: UserScore = await updateItemsService(
      postgresDBPool,
      uid,
      items
    );

    res.status(200).json({
      message: "User words updated successfully.",
      score,
    });
  } catch (err) {
    next(err);
  }
}

export async function getInfoController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const itemId: number = parseInt((req as any).params.itemId, 10);

    const itemInfo: ItemInfo[] = await getInfoRepository(
      postgresDBPool,
      itemId
    );

    res.status(200).json({
      message: "Item info retrieved successfully.",
      items: itemInfo,
    });
  } catch (err) {
    next(err);
  }
}
