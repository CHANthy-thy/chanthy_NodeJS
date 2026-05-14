import { Router } from 'express';
import {
  getAllTasks,
  createNewTask,
  updateExistingTask,
  deleteExistingTask,
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

router.get('/', getAllTasks);
router.post('/', createNewTask);
router.put('/:id', updateExistingTask);
router.delete('/:id', deleteExistingTask);

export default router;
