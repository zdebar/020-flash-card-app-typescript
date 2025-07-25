import { PostgresClient } from "../types/dataTypes";
import { UserScore } from "../../../shared/types/dataTypes";
import { getScoreRepository } from "../repository/user.repository.postgres";
import { resetBlockRepository } from "../repository/blocks.repository.postgres";

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function resetBlockService(
  db: PostgresClient,
  uid: string,
  blockID: number
): Promise<UserScore[]> {
  await resetBlockRepository(db, uid, blockID);
  return await getScoreRepository(db, uid);
}
