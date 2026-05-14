import { getDb } from './sqlite';
import { migrate } from './utils';
import { migrationName as m002, upSql as sql002 } from './migrations/002_create_tasks_table';
import { migrationName as m003, upSql as sql003 } from './migrations/003_create_users_table';
import { migrationName as m004, upSql as sql004 } from './migrations/004_add_user_id_to_tasks';

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  
  await Promise.all([
    migrate(db, m002, sql002),
    migrate(db, m003, sql003),
    migrate(db, m004, sql004),
  ]);
}
