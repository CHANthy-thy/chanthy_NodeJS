import type { Database } from 'sqlite';

export async function runMigrationsTable(db: Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL
    );
  `);
}

export type MigrationResult = {
  applied: boolean;
};

export async function shouldApplyMigration(db: Database, name: string): Promise<boolean> {
  const row = await db.get<{ name: string }>('SELECT name FROM migrations WHERE name = ?', [name]);
  return !row;
}

export async function markMigrationApplied(db: Database, name: string): Promise<void> {
  await db.run('INSERT INTO migrations (name, applied_at) VALUES (?, datetime("now"))', [name]);
}

export async function migrate(db: Database, name: string, sql: string): Promise<MigrationResult> {
  const willApply = await shouldApplyMigration(db, name);
  if (!willApply) return { applied: false };

  await db.exec(sql);
  await markMigrationApplied(db, name);
  return { applied: true };
}

