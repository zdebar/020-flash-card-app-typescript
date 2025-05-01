import { PostgresClient } from "../types/dataTypes";
import { UserScore, UserSettings } from "../../../shared/types/dataTypes";
import { getScoreRepository } from "../repository/practice.repository.postgres";
import { getUserRepository } from "../repository/user.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<{ userSettings: UserSettings; userScore: UserScore }> {
  const userSettings: UserSettings = await getUserRepository(db, uid);
  const userScore: UserScore = await getScoreRepository(db, uid);
  return { userSettings, userScore };
}
