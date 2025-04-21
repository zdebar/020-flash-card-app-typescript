import { getUserPostgres } from "../repository/user.repository.postgres";
import { User, PostgresClient, Score } from "../types/dataTypes";
import { getScorePostgres } from "../repository/practice.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<{ user: User; score: Score[] }> {
  const user: User = await getUserPostgres(db, uid);
  const score: Score[] = await getScorePostgres(db, uid);
  return { user, score };
}
