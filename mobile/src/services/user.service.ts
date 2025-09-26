import { PostgresClient } from "../types/dataTypes";
import { UserScore } from "../../../shared/types/dataTypes";
import { getUserScoreRepository } from "../repository/user.repository.postgres";
import {
  insertUserRepository,
  resetUserLanguageRepository,
} from "../repository/user.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<UserScore[]> {
  await insertUserRepository(db, uid);
  return await getUserScoreRepository(db, uid);
}

/**
 * Erase all items connnected to given user and language from user_items table. Returns the updated score.
 */
export async function resetUserLanguageService(
  db: PostgresClient,
  uid: string,
  languageId: number
): Promise<UserScore[]> {
  await resetUserLanguageRepository(db, uid, languageId);
  return await getUserScoreRepository(db, uid);
}
