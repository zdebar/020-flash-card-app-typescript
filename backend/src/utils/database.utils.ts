import { PoolClient, QueryResult, QueryResultRow } from "pg";
import { PostgresClient } from "../types/dataTypes";

interface ConnectAndQueryParams<T extends QueryResultRow> {
  pool: PostgresClient;
  query: string;
  params?: any[];
  onError?: (error: Error) => void;
}

/**
 * So far unused refactor of database pool connection.
 *
 * @param param0
 * @returns
 */
export async function connectAndQuery<T extends QueryResultRow>({
  pool,
  query,
  params = [],
  onError,
}: ConnectAndQueryParams<T>): Promise<QueryResult<T>> {
  const client = (await pool.connect()) as PoolClient;
  try {
    return await client.query(query, params);
  } catch (err: any) {
    if (onError) {
      onError(err);
    }
    throw err;
  } finally {
    client.release();
  }
}
