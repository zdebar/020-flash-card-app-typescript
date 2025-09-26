import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { BlockExplanation } from "../../../shared/types/dataTypes";
import { formatRepositoryError } from "../utils/error.utils";

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
      formatRepositoryError(error, "getGrammarListRepository", {
        dbType: typeof db,
        uid,
        languageId,
        categoryId,
      })
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
    const deleteUserItemsQuery = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      )
      DELETE FROM user_items ui
      USING items i, user_cte uc
      WHERE ui.item_id = i.id
        AND i.block_id = $2
        AND ui.user_id = uc.user_id;
    `;

    const deleteUserBlocksQuery = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      )
      DELETE FROM user_blocks
      WHERE block_id = $2 
        AND user_id = (SELECT user_id FROM user_cte);
    `;

    await withDbClient(db, async (client) => {
      await client.query("BEGIN");
      await client.query(deleteUserItemsQuery, [uid, blockId]);
      await client.query(deleteUserBlocksQuery, [uid, blockId]);
      await client.query("COMMIT");
    });
  } catch (error) {
    throw new Error(
      formatRepositoryError(error, "resetBlockRepository", {
        dbType: typeof db,
        uid,
        blockId,
      })
    );
  }
}
