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
  getItemInfoService,
} from "../services/items.service";
import {
  getWordsRepository,
  getWordsCountRepository,
} from "../repository/items.repository.postgres";

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

    console.log("itemInfo", itemInfo); // debug
    res.status(200).json({
      message: "Item info retrieved successfully.",
      itemInfo,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get list of started words.
 */
export async function getWordsController(
  req: Request,
  res: Response,
  next: Function
): Promise<void> {
  try {
    const uid: string = (req as any).user.uid;
    const page: number = parseInt(req.query.page as string, 10) || 1;
    const limit: number = parseInt(req.query.limit as string, 10) || 10;
    const offset: number = (page - 1) * limit;

    const data: Item[] = await getWordsRepository(
      postgresDBPool,
      uid,
      limit,
      offset
    );

    // Calculate total pages (assuming getWordsRepository can provide total count)
    const totalCount: number = await getWordsCountRepository(
      postgresDBPool,
      uid
    ); // Add a repository function to get total count
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "User words retrieved successfully.",
      data,
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
