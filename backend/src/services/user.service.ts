import { getUserPostgres } from "../repository/user.repository.postgres";
import { PostgresClient } from "../types/dataTypes";
import { UserSettings, UserScore } from "../../../shared/types/dataTypes";
import { getScore } from "../repository/vocabulary.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<{ userSettings: UserSettings; userScore: UserScore }> {
  const userSettings: UserSettings = await getUserPostgres(db, uid);
  const userScore: UserScore = await getScore(db, uid);
  return { userSettings, userScore };
}
