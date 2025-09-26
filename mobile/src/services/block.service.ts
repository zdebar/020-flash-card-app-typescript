import { UserScore } from "../../../shared/types/dataTypes";
import { getUserScoreRepository } from "../repository/user.repository.postgres";
import { resetBlockRepository } from "../repository/blocks.repository.postgres";

/**
 * Updates the user's word progress in the PostgreSQL database and returns the updated score.
 */
export async function resetBlockService(
  db: PostgresClient,
  uid: string,
  blockId: number
): Promise<UserScore[]> {
  await resetBlockRepository(db, uid, blockId);
  return await getUserScoreRepository(db, uid);
}
