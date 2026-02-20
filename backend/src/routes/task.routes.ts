import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  deleteAllTasks
} from '../controllers/task.controller';
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskId,
  validateHighPriorityConstraint
} from '../middleware/validation';

const router = Router();

// CREATE - POST /api/tasks
router.post('/tasks', validateCreateTask, createTask);

// READ - GET /api/tasks (get all tasks, with optional status filter)
router.get('/tasks', getAllTasks);

// READ - GET /api/tasks/:id (get single task)
router.get('/tasks/:id', validateTaskId, getTaskById);

// UPDATE - PUT /api/tasks/:id
router.put('/tasks/:id', validateTaskId, validateUpdateTask, validateHighPriorityConstraint, updateTask);

// DELETE - DELETE /api/tasks/:id (delete single task)
router.delete('/tasks/:id', validateTaskId, deleteTask);

// DELETE - DELETE /api/tasks (delete all tasks - for testing)
router.delete('/tasks', deleteAllTasks);

export default router;
