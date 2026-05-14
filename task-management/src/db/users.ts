import { getDb } from './sqlite';
import bcrypt from 'bcryptjs';

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export async function createUser(input: {
  username: string;
  email: string;
  password: string;
}): Promise<User> {
  const db = await getDb();

  const hashedPassword = await bcrypt.hash(input.password, 12);
  const now = new Date().toISOString();

  const result = await db.run(
    'INSERT INTO users (username, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
    [input.username, input.email, hashedPassword, now, now]
  );

  const id = result.lastID as number;
  const created = await db.get<User>(
    'SELECT id, username, email, createdAt, updatedAt FROM users WHERE id = ?',
    [id]
  );

  if (!created) throw new Error('Failed to create user');
  return created;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  const user = await db.get<User>(
    'SELECT id, username, email, password, createdAt, updatedAt FROM users WHERE email = ?',
    [email]
  );

  return user || null;
}

export async function findUserById(id: number): Promise<User | null> {
  const db = await getDb();
  const user = await db.get<User>(
    'SELECT id, username, email, createdAt, updatedAt FROM users WHERE id = ?',
    [id]
  );

  return user || null;
}

export async function validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}