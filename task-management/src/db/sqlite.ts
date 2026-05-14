import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let dbPromise: Promise<Database> | null = null;

function getDatabaseFile(): string {
  const fromEnv = process.env.SQLITE_PATH;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv;

  // default: ./data/task-management.sqlite (relative to project root)
  return path.join(process.cwd(), 'data', 'task-management.sqlite');
}

export async function getDb(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = open({
      filename: getDatabaseFile(),
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}

