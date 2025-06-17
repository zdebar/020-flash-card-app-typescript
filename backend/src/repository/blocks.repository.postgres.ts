import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { BlockExplanation } from "../../../shared/types/dataTypes";

export async function getGrammarListRepository(
  db: PostgresClient,
  uid: string
): Promise<BlockExplanation[]> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id 
        FROM users 
        WHERE uid = $1
      ),
      blocks_started_cte AS (
        SELECT DISTINCT bi.block_id AS blocks_started
        FROM block_items bi
        JOIN items i ON i.id = bi.item_id
        JOIN user_items ui ON i.id = ui.item_id        
        WHERE ui.user_id = (SELECT user_id FROM user_cte)
        GROUP BY ui.user_id, i.id, bi.block_id
      )
      SELECT 
        b.id,
        b.sequence,
        b.name,
        b.explanation,      
      FROM blocks b
      WHERE b.id IN (SELECT blocks_started FROM blocks_started_cte)
        and b.category_id = 1
    `;

    return await withDbClient(db, async (client) => {
      const result = await client.query(query, [uid]);
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
      } | db type: ${typeof db} | uid: ${uid}`
    );
  }
}
