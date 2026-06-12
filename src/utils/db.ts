import Database, { type Database as DBType } from "better-sqlite3";

// creating database
const db: DBType = new Database("wakatime-widget.sqlite");

// creating schema of the database
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        wt_key TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export { db };
