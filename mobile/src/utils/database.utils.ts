import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("databaseName");
  }
  return db;
}

const firstRow = await db.getFirstAsync("SELECT * FROM test");
const allRows = await db.getAllAsync("SELECT * FROM test");
for await (const row of db.getEachAsync("SELECT * FROM test")) {
  console.log(row.id, row.value, row.intValue);
}
