import { PostgresClient } from "../types/dataTypes";
import { UserSettings } from "../../../shared/types/dataTypes";
import { QueryResult } from "pg";
import { withDbClient } from "../utils/database.utils";
import {
  validateUid,
  validateEmail,
  validateName,
} from "../utils/validate.utils";

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
  validateUid(uid);

  if (!validateName(name)) {
    name = null;
  }

  if (!validateEmail(email)) {
    email = null;
  }

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
