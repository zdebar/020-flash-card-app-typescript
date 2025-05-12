import { PostgresClient } from "../types/dataTypes";
import { UserSettings } from "../../../shared/types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Finds User by userUid. Creates a new user if not found.
 * @throws Error if the user does not exist.
 */
export async function getUserRepository(
  db: PostgresClient,
  uid: string,
  name: string | null,
  email: string | null
): Promise<UserSettings> {
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
}

export async function patchNotesRepository(
  db: PostgresClient,
  uid: string,
  note: string
): Promise<void> {
  return withDbClient(db, async (client) => {
    await client.query(
      `
      WITH user_cte AS (
        SELECT id AS user_id FROM users WHERE uid = $1
      )
      INSERT INTO user_notes (user_id, date, note)
      VALUES ((SELECT user_id FROM user_cte), DEFAULT, $2);
      `,
      [uid, note]
    );
  });
}
