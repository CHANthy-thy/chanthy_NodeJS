import type { Response } from 'express';
import { TaskService } from '../services/taskService';
import type { AuthRequest } from '../middleware/auth';

const taskService = new TaskService();

export async function getAllTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const tasks = await taskService.list(req.user.id);
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

export async function createNewTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { title, description } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      return;
    }

    if (title.length > 100) {
      res.status(400).json({ error: 'Title must be less than 100 characters' });
      return;
    }

    if (description && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' });
      return;
    }

    const newTask = await taskService.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      userId: req.user.id
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

export async function updateExistingTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      return;
    }

    if (title.length > 100) {
      res.status(400).json({ error: 'Title must be less than 100 characters' });
      return;
    }

    if (description && typeof description !== 'string') {
      res.status(400).json({ error: 'Description must be a string' });
      return;
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
      res.status(400).json({ error: 'Completed must be a boolean' });
      return;
    }

    const updated = await taskService.update({
      id: Number(id),
      title: title.trim(),
      description: description ? description.trim() : null,
      completed: completed ? 1 : 0,
      userId: req.user.id
    });

    if (!updated) {
      res.status(404).json({ error: 'Task not found or access denied' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function deleteExistingTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { id } = req.params;

    const success = await taskService.remove(Number(id), req.user.id);

    if (!success) {
      res.status(404).json({ error: 'Task not found or access denied' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
}
