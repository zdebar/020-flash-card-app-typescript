import {
  getUserByUidPostgres,
  updateUserPostgres,
} from "../repository/user.repository.postgres";
import { UserError, User, PostgresClient, Score } from "../types/dataTypes";
import { getScorePostgres } from "../repository/practice.repository.postgres";

/**
 * Retrieves the user information and score for a given user ID from the database.
 */
export async function getUserService(
  db: PostgresClient,
  uid: string
): Promise<{ user: User; score: Score[] }> {
  const user: User = await getUserByUidPostgres(db, uid);
  const score: Score[] = await getScorePostgres(db, uid);
  return { user, score };
}

/**
 * Retrieves the user preferences for a given user ID from the database.
 * TODO: consider deleteing, so far not used
 */
export async function updateUserService(
  db: PostgresClient,
  user: User
): Promise<User> {
  const userUpdated: User = await updateUserPostgres(db, user);
  return userUpdated;
}
