import { v4 as uuidv4 } from "uuid";
import db from "../config/database";

async function createUser() {
  const uid = uuidv4(); // Generate a unique identifier
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO users (uid) VALUES (?);`,
        [uid],
        (_, result) => resolve(result.insertId),
        (_, error) => reject(error)
      );
    });
  });
}
