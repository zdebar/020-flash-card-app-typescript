import { PostgresClient } from "../types/dataTypes";
import { UserSettings } from "../../../shared/types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Finds User by userUid. Creates a new user if not found.
 */
export async function getUserRepository(
  db: PostgresClient,
  uid: string,
  name: string | null,
  email: string | null
): Promise<UserSettings> {
  try {
    return withDbClient(db, async (client) => {
      const user: QueryResult<UserSettings> = await client.query(
        `
        INSERT INTO users (uid, name, email)
        VALUES ($1, $2, $3)
        ON CONFLICT (uid) DO UPDATE
        SET name = EXCLUDED.name,
            email = EXCLUDED.email
        RETURNING id;
        `,
        [uid, name, email]
      );

      return user.rows[0];
    });
  } catch (error) {
    throw new Error(
      `Error in getUserRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | name: ${name} | email: ${email}`
    );
  }
}

/**
 * Finds User by userUid. Creates a new user if not found.
 * @throws Error if the user does not exist.
 */
export async function resetUserLanguageRepository(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<void> {
  try {
    await withDbClient(db, async (client) => {
      const user: QueryResult<UserSettings> = await client.query(
        `
        WITH user_cte AS (
          SELECT id AS user_id FROM users WHERE uid = $1
        )
        DELETE FROM user_items
        USING items, user_cte
        WHERE user_items.item_id = items.id
          AND items.language_id = $2
          AND user_items.user_id = user_cte.user_id;
        `,
        [uid, languageID]
      );
    });
  } catch (error) {
    throw new Error(
      `Error in resetUserLanguageRepository: ${
        (error as any).message
      } | db type: ${typeof db} | uid: ${uid} | languageID: ${languageID}`
    );
  }
}
