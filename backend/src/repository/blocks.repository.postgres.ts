import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import { Block } from "../../../shared/types/dataTypes";

export async function getGrammarListRepository(
  db: PostgresClient,
  uid: string
): Promise<Block[]> {
  const query = `
    WITH user_cte AS (
      SELECT id AS user_id FROM users WHERE uid = $1
    ),
    user_words_count_cte AS (
      SELECT COUNT(*) AS user_words_count
      FROM items i
      JOIN user_items ui ON i.id = ui.item_id
      WHERE ui.user_id = (SELECT user_id FROM user_cte)
        AND i.item_order IS NOT NULL
    )
    SELECT 
      b.id AS block_id,
      b.block_order,
      b.block_name,
      b.block_explanation,      
      b.category_id
    FROM blocks b
    WHERE b.block_order <= (SELECT user_words_count FROM user_words_count_cte)
    	and b.category_id = 1
  `;

  return await withDbClient(db, async (client) => {
    const result = await client.query(query, [uid]);
    return result.rows;
  });
}
