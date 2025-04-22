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

/**
 * Updates User Settings.
 */
export async function updateUserPostgres(
  db: PostgresClient,
  uid: string,
  user: UserSettings
): Promise<UserSettings> {
  return withDbClient(db, async (client) => {
    const updatedUser: QueryResult<UserSettings> = await client.query(
      `
      UPDATE users
      SET 
        mode_day = $2,
        font_size = $3
        plan_type = $4
      WHERE uid = $1
      RETURNING uid, mode_day, font_size, plan_type
      `,
      [uid, user.mode_day, user.font_size, user.plan_type]
    );

    if (!updatedUser.rows.length) {
      throw new Error(`User with id ${uid} not found!`);
    }
    return updatedUser.rows[0];
  });
}
