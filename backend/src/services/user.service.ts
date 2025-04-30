import { PostgresClient } from "../types/dataTypes";
import { UserScore } from "../../../shared/types/dataTypes";
import { getScore } from "../repository/practice.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<{ userScore: UserScore }> {
  const userScore: UserScore = await getScore(db, uid);
  return { userScore };
}
