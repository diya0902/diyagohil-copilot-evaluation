import { Request, Response, NextFunction } from 'express';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
let tasks: Task[] = [];

// CREATE - Add a new task
export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { title, description, status, priority, dueDate }: CreateTaskDto = req.body;

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      status: status || TaskStatus.TODO,
      priority: priority || TaskPriority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// READ - Get all tasks
export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { status, sortBy } = req.query;

    let filteredTasks = tasks;

    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredTasks = tasks.filter(task => task.status === status.toUpperCase());
    }

    // Sort by dueDate if sortBy parameter is provided
    if (sortBy === 'dueDate:asc' || sortBy === 'dueDate:desc') {
      filteredTasks = [...filteredTasks].sort((a, b) => {
        // Tasks without due dates should be at the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        
        return sortBy === 'dueDate:asc' ? dateA - dateB : dateB - dateA;
      });
    }

    res.status(200).json({
      count: filteredTasks.length,
      tasks: filteredTasks
    });
  } catch (error) {
    next(error);
  }
};

// READ - Get a single task by ID
export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;

    const task = tasks.find(t => t.id === id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// UPDATE - Update a task
export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate }: UpdateTaskDto = req.body;

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Update task
    const updatedTask: Task = {
      ...tasks[taskIndex],
      title: title !== undefined ? title.trim() : tasks[taskIndex].title,
      description: description !== undefined ? description.trim() : tasks[taskIndex].description,
      status: status || tasks[taskIndex].status,
      priority: priority || tasks[taskIndex].priority,
      dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : undefined) : tasks[taskIndex].dueDate,
      updatedAt: new Date()
    };

    tasks[taskIndex] = updatedTask;
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete a task
export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    res.status(200).json({
      message: 'Task deleted successfully',
      task: deletedTask
    });
  } catch (error) {
    next(error);
  }
};

// DELETE - Delete all tasks (for testing purposes)
export const deleteAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const count = tasks.length;
    tasks = [];

    res.status(200).json({
      message: 'All tasks deleted successfully',
      count
    });
  } catch (error) {
    next(error);
  }
};
