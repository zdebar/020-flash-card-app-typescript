import { UserScore } from "../../../shared/types/dataTypes";
import { getUserScoreRepository } from "../repository/user.repository.postgres";
import { resetBlockRepository } from "../repository/blocks.repository.postgres";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function resetBlockProgressService(
  db: SQLiteDatabase,
  uid: string,
  blockId: number
): Promise<UserScore[]> {
  await resetBlockRepository(db, uid, blockId);
  return await getUserScoreRepository(db, uid);
}
