import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { BlockExplanation } from "../../../shared/types/dataTypes";

/**
 * Provides a list of unlocked grammar blocks for a specific user, languageId, categoryId.
 * @param db
 * @param uid
 * @param languageId
 * @returns
 */
export async function getGrammarListRepository(
  db: PostgresClient,
  uid: string,
  languageId: number,
  categoryId: number
): Promise<BlockExplanation[]> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      )
      SELECT 
        b.id AS "blockId",
        b.sequence AS "blockSequence",
        b.name AS "blockName",
        n.note AS "blockExplanation" 
      FROM blocks b
      JOIN user_blocks ub ON b.id = ub.block_id
      JOIN notes n ON b.note_id = n.id
      WHERE b.language_id = $2
        AND b.category_id = $3
      ORDER BY b.sequence;
    `;

    const res = await withDbClient(db, async (client) => {
      return await client.query(query, [uid, languageId, categoryId]);
    });

    return res.rows;
  } catch (error) {
    throw new Error(
      `Error in getGrammarListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId} | categoryId: ${categoryId}`
    );
  }
}

/**
 * Resets a specific block for a user, removing all user_items associated with that block.
 */
export async function resetBlockRepository(
  db: PostgresClient,
  uid: string,
  blockId: number
): Promise<void> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      )
      DELETE FROM user_items
      USING block_items, user_cte
      WHERE user_items.item_id = block_items.item_id
        AND block_items.block_id = $2
        AND user_items.user_id = user_cte.user_id;

      DELETE FROM user_blocks
      WHERE block_id = $2 
        AND user_id = (SELECT user_id FROM user_cte);
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid, blockId]);
    });
  } catch (error) {
    throw new Error(
      `Error in resetBlockRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | blockId: ${blockId}`
    );
  }
}
