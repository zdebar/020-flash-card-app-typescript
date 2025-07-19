import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { BlockExplanation } from "../../../shared/types/dataTypes";

/**
 * Provides a list of unlocked grammar blocks for a specific user and language.
 * @param db
 * @param uid
 * @param languageID
 * @returns
 */
export async function getGrammarListRepository(
  db: PostgresClient,
  uid: string,
  languageID: number
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
        b.explanation
      FROM blocks b
      WHERE b.id IN (SELECT block_id FROM block_items_cte)
        AND b.category_id = 1
        AND b.language_id = $2
      ORDER BY b.sequence;
    `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [uid, languageID]);
      return result.rows.map((row) => ({
        blockId: row.id,
        blockSequence: row.sequence,
        blockName: row.name,
        blockExplanation: row.explanation,
      }));
    });
  } catch (error) {
    throw new Error(
      `Error in getGrammarListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageID: ${languageID}`
    );
  }
}
