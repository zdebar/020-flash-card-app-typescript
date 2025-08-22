import { PostgresClient } from "../types/dataTypes";
import { withDbClient } from "../utils/database.utils";
import config from "../config/config";
import { Item, BlockExplanation } from "../../../shared/types/dataTypes";

/**
 * Returns practice items from latest block for a user from PostgreSQL database.
 */
export async function getPracticeBlockRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<Item[]> {
  try {
    const runQuery = async (): Promise<Item[]> => {
      const query = `
        WITH user_cte AS (
          SELECT id AS user_id 
          FROM users 
          WHERE uid = $1
        ),
        learned_count_cte AS (
          SELECT COUNT(*) AS learned_count
          FROM user_items ui
          JOIN items i ON ui.item_id = i.id
          JOIN blocks b ON i.block_id = b.id
          WHERE b.category_id = 4
            AND b.language_id = $2
            AND ui.user_id = (SELECT user_id FROM user_cte)
            AND ui.learned_at IS NOT NULL
        ),
        block_to_learn_cte as ( 
          SELECT b.id AS block_id, ub.progress AS block_progress
          FROM blocks b
          LEFT JOIN user_blocks ub ON b.id = ub.block_id AND ub.user_id = (SELECT user_id FROM user_cte)
          WHERE ub.finished_at IS NULL
            AND (ub.next_at IS NULL OR ub.next_at < NOW())
            AND b.sequence <= (SELECT learned_count FROM learned_count_cte)
            AND b.language_id = $2
            AND b.category_id IN (1, 2)
            AND b.level_id IS NOT NULL
          ORDER BY ub.next_at ASC NULLS LAST, b."sequence"
          LIMIT 1
        ),
        has_info_cte AS (
          SELECT i.id
          FROM items i
          JOIN blocks b ON i.block_id = b.id
          WHERE b.language_id = $2
            AND b.note_id IS NOT NULL

          UNION

          SELECT bi.item_id AS id
          FROM block_items bi
          JOIN blocks b ON bi.block_id = b.id
          WHERE b.language_id = $2
            AND b.note_id IS NOT NULL
        )
        SELECT
          i.id,
          i.czech,
          i.translation,
          i.pronunciation,
          i.audio,
          COALESCE((select block_progress from block_to_learn_cte), 0) AS progress,          
          EXISTS ( 
            SELECT 1
            FROM has_info_cte
            WHERE has_info_cte.id = i.id
          ) AS "hasContextInfo",
          (b.note_id IS NOT NULL and i.sequence = 1) AS "showContextInfo",
          b.id AS "blockId"
        FROM items i
        JOIN blocks b ON b.id = i.block_id AND b.id = (SELECT block_id FROM block_to_learn_cte)
      `;

      const res = await withDbClient(db, async (client) => {
        return await client.query(query, [uid, languageId]);
      });

      return res.rows;
    };

    return await runQuery();
  } catch (error) {
    throw new Error(
      `Error in getPracticeBlockRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId}`
    );
  }
}

/**
 * Returns practice items for a user from PostgreSQL database.
 */
export async function getPracticeItemsRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<Item[]> {
  try {
    const numWords: number = config.round;

    const runQuery = async (): Promise<Item[]> => {
      const query = `
        WITH user_cte AS ( 
          SELECT id AS user_id 
          FROM users 
          WHERE uid = $1
        ),
        has_info_cte AS ( 
          SELECT i.id
          FROM items i
          JOIN blocks b ON i.block_id = b.id
          WHERE b.language_id = $2
            AND b.note_id IS NOT NULL

          UNION

          SELECT bi.item_id AS id
          FROM block_items bi
          JOIN blocks b ON bi.block_id = b.id
          WHERE b.language_id = $2
            AND b.note_id IS NOT NULL
        )
        SELECT
          i.id,
          i.czech,
          i.translation,
          i.pronunciation,
          i.audio,
          COALESCE(ui.progress, 0) AS progress,
          EXISTS ( 
            SELECT 1
            FROM has_info_cte
            WHERE has_info_cte.id = i.id
          ) AS "hasContextInfo",
          FALSE AS "showContextInfo" 
        FROM items i 
        LEFT JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
        JOIN blocks b ON b.id = i.block_id 
        WHERE ui.mastered_at IS NULL
          AND (ui.next_at IS NULL OR ui.next_at < NOW())
          AND (b.category_id = 4 OR ui.progress is not null)
          AND b.language_id = $2
          AND b.level_id IS NOT NULL
        ORDER BY
          ui.next_at ASC NULLS LAST,
          COALESCE(b.sequence, i.sequence) ASC NULLS LAST,
          b.level_id ASC NULLS LAST,
          i.sequence ASC NULLS LAST
        LIMIT $3;
      `;

      const res = await withDbClient(db, async (client) => {
        return await client.query(query, [uid, languageId, numWords]);
      });

      return res.rows;
    };

    return await runQuery();
  } catch (error) {
    throw new Error(
      `Error in getPracticeItemsRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId}`
    );
  }
}

export async function updateUserBlockRepository(
  db: PostgresClient,
  uid: string,
  blockId: number,
  progress: number,
  nextAt: string | null,
  finishedAt: string | null
): Promise<void> {
  try {
    const query = `
      WITH user_id_cte AS (
        SELECT id AS user_id FROM users WHERE uid = $1
      )
      INSERT INTO user_blocks (user_id, block_id, progress, next_at, finished_at)
      SELECT user_id, $2, $3, $4, $5 FROM user_id_cte
      ON CONFLICT(user_id, block_id)
      DO UPDATE SET
        progress = EXCLUDED.progress,
        next_at = EXCLUDED.next_at,
        finished_at = CASE 
          WHEN user_blocks.finished_at IS NULL AND EXCLUDED.finished_at IS NOT NULL 
          THEN EXCLUDED.finished_at 
          ELSE user_blocks.finished_at 
        END;
    `;

    const values = [uid, blockId, progress, nextAt, finishedAt];

    await withDbClient(db, async (client) => {
      await client.query(query, values);
    });
  } catch (error) {
    throw new Error(
      `Error in updateUserBlockRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | block: ${blockId} | progress: ${progress} | nextAt: ${nextAt} | finishedAt: ${finishedAt}`
    );
  }
}

/**
 * Updates the user's word progress in a PostgreSQL database. --- learned_at a mastered_at se mění pouze při hraničním času
 */
export async function updateUserItemsRepository(
  db: PostgresClient,
  uid: string,
  itemIds: number[],
  progresses: number[],
  nextAt: (string | null)[],
  learnedAt: (string | null)[],
  masteredAt: (string | null)[]
): Promise<void> {
  try {
    const query = `
      WITH user_id_cte AS (
        SELECT id AS user_id FROM users WHERE uid = $1
      ),
      valid_items_cte AS (
        SELECT id AS item_id FROM items WHERE id = ANY($2::int[])
      ),
      item_data AS (
        SELECT 
          unnest($2::int[]) AS item_id,
          unnest($3::int[]) AS progress,
          unnest($4::timestamptz[]) AS next_at,
          unnest($5::timestamptz[]) AS learned_at,
          unnest($6::timestamptz[]) AS mastered_at
      )
      INSERT INTO user_items (user_id, item_id, progress, next_at, learned_at, mastered_at)
      SELECT 
        user_id,
        wd.item_id,
        wd.progress,
        wd.next_at,
        wd.learned_at,
        wd.mastered_at
      FROM user_id_cte, item_data wd
      JOIN valid_items_cte vi ON wd.item_id = vi.item_id
      ON CONFLICT(user_id, item_id) 
      DO UPDATE SET 
        progress = EXCLUDED.progress, 
        next_at = EXCLUDED.next_at, 
        learned_at = CASE 
          WHEN user_items.learned_at IS NULL AND EXCLUDED.learned_at IS NOT NULL 
          THEN EXCLUDED.learned_at 
          ELSE user_items.learned_at 
        END,
        mastered_at = CASE 
          WHEN user_items.mastered_at IS NULL AND EXCLUDED.mastered_at IS NOT NULL 
          THEN EXCLUDED.mastered_at 
          ELSE user_items.mastered_at 
        END;
      `;

    const values = [uid, itemIds, progresses, nextAt, learnedAt, masteredAt];

    await withDbClient(db, async (client) => {
      await client.query(query, values);
    });
  } catch (error) {
    throw new Error(
      `Error in updateUserItemsRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | itemIds: ${itemIds} | progresses: ${progresses} | nextAt: ${nextAt} | learnedAt: ${learnedAt} | masteredAt: ${masteredAt}`
    );
  }
}

/**
 * Gets relevant grammar info for given item id.
 */
export async function getItemInfoRepository(
  db: PostgresClient,
  itemId: number
): Promise<BlockExplanation[]> {
  try {
    const query = `
      SELECT 
        b.id AS blockId,
        b.sequence AS blockSequence,
        b.name AS blockName,
        n.note AS blockExplanation
      FROM blocks b
      JOIN notes n ON b.note_id = n.id
      WHERE b.id = $1

      UNION

      SELECT 
        b.id AS blockId,
        b.sequence AS blockSequence,
        b.name AS blockName,
        n.note AS blockExplanation
      FROM blocks b
      JOIN block_items bi ON b.id = bi.block_id
      JOIN notes n ON b.note_id = n.id
      WHERE b.id = $1
    `;

    const res = await withDbClient(db, async (client) => {
      return await client.query(query, [itemId]);
    });

    return res.rows;
  } catch (error) {
    throw new Error(
      `Error in getItemInfoRepository: ${
        (error as any).message
      } | db type: ${typeof db} | itemId: ${itemId}`
    );
  }
}

/**
 * Return required items for the user from PostgreSQL database.
 */
export async function getUserItemsListRepository(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<Item[]> {
  try {
    const numWords: number = config.round;

    const runQuery = async (): Promise<Item[]> => {
      const query = `
        WITH user_cte AS (
          SELECT id AS user_id FROM users WHERE uid = $1
        ),
        has_info_cte AS (
          SELECT bi.item_id
          FROM block_items bi
          JOIN blocks b ON bi.block_id = b.id
          WHERE b.language_id = $2
            AND b.note_id IS NOT NULL
        )
        SELECT
          i.id,
          i.czech,
          i.translation,
          i.pronunciation,
          i.audio,
          ui.next_at AS "nextDate",
          ui.learned_at AS "learnedDate",
          ui.mastered_at AS "masteredDate",
          COALESCE(ui.progress, 0) AS progress,
          EXISTS (
            SELECT 1
            FROM has_info_cte
            WHERE has_info_cte.item_id = i.id
          ) AS "hasContextInfo",
          FALSE AS "showContextInfo"
        FROM items i 
        JOIN user_items ui ON i.id = ui.item_id AND ui.user_id = (SELECT user_id FROM user_cte)
        JOIN blocks b ON i.block_id = b.id
        WHERE b.category_id = 4
          AND b.language_id = $2
        ORDER BY
          i.sequence ASC;
      `;

      const res = await withDbClient(db, async (client) => {
        return await client.query(query, [uid, languageId]);
      });

      return res.rows;
    };

    return await runQuery();
  } catch (error) {
    throw new Error(
      `Error in getUserItemsListRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageId: ${languageId}`
    );
  }
}

/**
 * Resets a specific item for a user, removing it from user_items.
 */
export async function resetItemRepository(
  db: PostgresClient,
  uid: string,
  itemId: number
): Promise<void> {
  try {
    const query = `
      WITH user_cte AS (
        SELECT id AS user_id FROM users WHERE uid = $1
      )
      DELETE FROM user_items
      WHERE user_items.item_id = $2
        AND user_items.user_id = (SELECT user_id FROM user_cte);
    `;

    await withDbClient(db, async (client) => {
      await client.query(query, [uid, itemId]);
    });
  } catch (error) {
    throw new Error(
      `Error in resetItemRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | itemId: ${itemId}`
    );
  }
}
