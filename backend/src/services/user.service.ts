import { PostgresClient } from "../types/dataTypes";
import { UserScore, UserSettings } from "../../../shared/types/dataTypes";
import { getScoreRepository } from "../repository/user.repository.postgres";
import {
  getUserRepository,
  resetUserLanguageRepository,
} from "../repository/user.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string,
  name: string | null,
  email: string | null
): Promise<{ userSettings: UserSettings; userScore: UserScore[] }> {
  const [userSettings, userScore] = await Promise.all([
    getUserRepository(db, uid, name, email),
    getScoreRepository(db, uid),
  ]);
  return { userSettings, userScore };
}

/**
 * Erase all items connnected to given user and language from user_items table. Returns the updated score.
 */
export async function resetUserLanguageService(
  db: PostgresClient,
  uid: string,
  languageID: number
): Promise<UserScore[]> {
  await resetUserLanguageRepository(db, uid, languageID);
  return await getScoreRepository(db, uid);
}
