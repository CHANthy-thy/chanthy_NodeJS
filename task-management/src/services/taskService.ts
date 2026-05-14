import {
  TaskRepository,
  type TaskCreateInput,
  type TaskUpdateInput,
} from '../repositories/taskRepository';
import type { Task } from '../db/tasks';

export class TaskService {
  private repo: TaskRepository;

  constructor(repo?: TaskRepository) {
    this.repo = repo ?? new TaskRepository();
  }

  async list(userId: number): Promise<Task[]> {
    return this.repo.list(userId);
  }

  async create(input: TaskCreateInput): Promise<Task> {
    return this.repo.create(input);
  }

  async update(input: TaskUpdateInput): Promise<Task | null> {
    return this.repo.update(input);
  }

  async remove(id: number, userId: number): Promise<boolean> {
    return this.repo.remove(id, userId);
  }
}
