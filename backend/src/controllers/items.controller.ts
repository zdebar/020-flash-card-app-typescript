import { Request, Response } from "express";
import { postgresDBPool } from "../config/database.config.postgres";
import { UserScore, Item, ItemInfo } from "../../../shared/types/dataTypes";
import {
  getItemsService,
  patchItemsService,
  getItemInfoService,
} from "../services/items.service";

/**
 * Controller function to retrieve user-specific practice words.
 */
export async function getItemsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;

    const data: Item[] = await getItemsService(postgresDBPool, uid);

    res.status(200).json({
      message: "User words retrieved successfully.",
      data,
    });
  } catch (err) {
    (err as any).message = `Error in getItemsController: ${
      (err as any).message
    } | uid: ${(req as any).user.uid}`;
    next(err);
  }
}

/**
 * Updates practice user_words progress. Sends back the updated score.
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
    (err as any).message = `Error in patchItemsController: ${
      (err as any).message
    } | uid: ${(req as any).user.uid} | items: ${JSON.stringify(
      (req as any).body.items
    )} | onBlockEnd: ${(req as any).body.onBlockEnd}`;
    next(err);
  }
}

/**
 * Get context information for a specific word.
 */
export async function getInfoController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const itemId: number = parseInt((req as any).params.itemId, 10);

    const data: ItemInfo[] = await getItemInfoService(postgresDBPool, itemId);

    res.status(200).json({
      message: "Item info retrieved successfully.",
      data,
    });
  } catch (err) {
    (err as any).message = `Error in getInfoController: ${
      (err as any).message
    } | uid: ${(req as any).params.itemId}`;
    next(err);
  }
}
