import { PostgresClient } from "../types/dataTypes";
import { UserSettings, UserInfo } from "../../../shared/types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Finds User by userUid. Creates a new user if not found.
 * @throws Error if the user does not exist.
 */
export async function getUserPostgres(
  db: PostgresClient,
  uid: string
): Promise<UserSettings> {
  return withDbClient(db, async (client) => {
    const existingUser: QueryResult<UserSettings> = await client.query(
      `
      SELECT mode_day, font_size, plan_type
      FROM users
      WHERE uid = $1;
      `,
      [uid]
    );

    if (existingUser.rows.length) {
      return existingUser.rows[0];
    }

    const newUser: QueryResult<UserSettings> = await client.query(
      `
      INSERT INTO users (uid)
      VALUES ($1)
      RETURNING mode_day, font_size, plan_type;
      `,
      [uid]
    );

    return newUser.rows[0];
  });
}
