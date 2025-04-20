import { User, PostgresClient } from "../types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";

/**
 * Finds User by userUid. Creates a new user if not found.
 * @throws Error if the user does not exist.
 */
export async function getUserByUidPostgres(
  db: PostgresClient,
  uid: string
): Promise<User> {
  return withDbClient(db, async (client) => {
    const existingUser: QueryResult<User> = await client.query(
      `
      SELECT uid, mode_day, font_size, plan_type
      FROM users
      WHERE uid = $1;
      `,
      [uid]
    );

    if (existingUser.rows.length) {
      return existingUser.rows[0];
    }

    const newUser: QueryResult<User> = await client.query(
      `
      INSERT INTO users (uid)
      VALUES ($1)
      RETURNING uid, mode_day, font_size, plan_type;
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
  user: User
): Promise<User> {
  return withDbClient(db, async (client) => {
    const updatedUser: QueryResult<User> = await client.query(
      `
      UPDATE users
      SET 
        mode_day = $2,
        font_size = $3
        plan_type = $4
      WHERE uid = $1
      RETURNING uid, mode_day, font_size, plan_type
      `,
      [user.uid, user.mode_day, user.font_size, user.plan_type]
    );

    if (!updatedUser.rows.length) {
      throw new Error(`User with id ${user.uid} not found!`);
    }
    return updatedUser.rows[0];
  });
}
