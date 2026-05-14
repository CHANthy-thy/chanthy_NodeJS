import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
} from '../db/tasks';

export type TaskCreateInput = {
  title: string;
  description: string | null;
  userId: number;
};

export type TaskUpdateInput = {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  userId: number;
};

export class TaskRepository {
  async list(userId: number): Promise<Task[]> {
    return getTasks(userId);
  }

  async create(input: TaskCreateInput): Promise<Task> {
    return createTask(input);
  }

  async update(input: TaskUpdateInput): Promise<Task | null> {
    return updateTask(input);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    return deleteTask(id, userId);
  }
}
