import Database, { type Database as DBType } from "better-sqlite3";

const db: DBType = new Database("wakatime-widget.sqlite");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        wakatime_token TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export { db };
