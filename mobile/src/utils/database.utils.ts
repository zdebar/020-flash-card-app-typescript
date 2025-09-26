import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("flashcards.db");

export default db;
