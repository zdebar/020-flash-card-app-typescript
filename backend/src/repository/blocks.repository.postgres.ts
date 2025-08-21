import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { BlockExplanation } from "../../../shared/types/dataTypes";

/**
 * Provides a list of unlocked grammar blocks for a specific user and language.
 * @param db
 * @param uid
 * @param languageId
 * @returns
 */
export async function getGrammarListRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<BlockExplanation[]> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      ),
      user_items_cte AS (
        SELECT ui.item_id
        FROM user_items ui
        WHERE ui.user_id = (SELECT user_id FROM user_cte)
      ),
      block_items_cte AS (
        SELECT bi.block_id
        FROM block_items bi
        JOIN items i ON i.id = bi.item_id
        WHERE bi.item_id IN (SELECT item_id FROM user_items_cte)
      )
      SELECT 
        b.id,
        b.sequence,
        b.name,
        n.note 
      FROM blocks b
      JOIN notes n ON b.note_id = n.id
      WHERE b.id IN (SELECT block_id FROM block_items_cte)
        AND b.category_id = 1
        AND b.language_id = $2
      ORDER BY b.sequence;
    `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [uid, languageId]);
      return result.rows.map((row) => ({
        blockId: row.id,
        blockSequence: row.sequence,
        blockName: row.name,
        blockExplanation: row.note,
      }));
    });
  } catch (error) {
    throw new Error(
      `Error in getGrammarListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId}`
    );
  }
}

/**
 * Provides a list of unlocked grammar practice blocks for a specific user and language.
 * @param db
 * @param uid
 * @param languageId
 * @returns
 */
export async function getGrammarPracticeListRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<BlockExplanation[]> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      ),
      user_items_cte AS (
        SELECT ui.item_id
        FROM user_items ui
        WHERE ui.user_id = (SELECT user_id FROM user_cte)
      ),
      block_items_cte AS (
        SELECT bi.block_id
        FROM block_items bi
        JOIN items i ON i.id = bi.item_id
        WHERE bi.item_id IN (SELECT item_id FROM user_items_cte)
      )
      SELECT 
        b.id,
        b.sequence,
        b.name,
        n.note 
      FROM blocks b
      JOIN notes n ON b.note_id = n.id
      WHERE b.id IN (SELECT block_id FROM block_items_cte)
        AND b.category_id = 2
        AND b.language_id = $2
      ORDER BY b.sequence;
    `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [uid, languageId]);
      return result.rows.map((row) => ({
        blockId: row.id,
        blockSequence: row.sequence,
        blockName: row.name,
        blockExplanation: row.note,
      }));
    });
  } catch (error) {
    throw new Error(
      `Error in getGrammarPracticeListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId}`
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
