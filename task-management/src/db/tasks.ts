import type { Database } from 'sqlite';
import { getDb } from './sqlite';
import { runMigrations } from './migrate';


export type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export async function getTasks(userId: number): Promise<Task[]> {
  const db = await getDb();
  return db.all<Task[]>('SELECT id, title, description, completed, createdAt, updatedAt, userId FROM tasks WHERE userId = ? ORDER BY id DESC', [userId]);

}

export async function createTask(input: {
  title: string;
  description: string | null;
  userId: number;
}): Promise<Task> {
  const db = await getDb();
  await runMigrations();

  const now = new Date().toISOString();
  const result = await db.run(
    'INSERT INTO tasks (title, description, completed, createdAt, updatedAt, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [input.title, input.description || null, 0, now, now, input.userId]
  );

  const id = result.lastID as number;
  const created = await db.get<Task>('SELECT id, title, description, completed, createdAt, updatedAt, userId FROM tasks WHERE id = ?', [id]);
  if (!created) throw new Error('Failed to create task');
  return created;
}

export async function updateTask(input: {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  userId: number;
}): Promise<Task | null> {
  const db = await getDb();
  await runMigrations();

  const now = new Date().toISOString();
  const result = await db.run(
    'UPDATE tasks SET title = ?, description = ?, completed = ?, updatedAt = ? WHERE id = ? AND userId = ?',
    [input.title, input.description || null, input.completed, now, input.id, input.userId]
  );

  if (!result.changes || result.changes === 0) return null;

  const updated = await db.get<Task>('SELECT id, title, description, completed, createdAt, updatedAt, userId FROM tasks WHERE id = ?', [input.id]);
  return updated || null;
}

export async function deleteTask(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  await runMigrations();

  const result = await db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
  return (result.changes || 0) > 0;
}
