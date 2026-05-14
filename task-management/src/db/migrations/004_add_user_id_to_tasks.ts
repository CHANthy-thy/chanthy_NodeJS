export const migrationName = '004_add_user_id_to_tasks';

export const upSql = `
  ALTER TABLE tasks ADD COLUMN userId INTEGER;
  CREATE INDEX idx_tasks_user_id ON tasks(userId);
`;