import { Request, Response, NextFunction } from 'express';
import { TaskStatus, TaskPriority } from '../models/task.model';

export const validateCreateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, status, priority, dueDate } = req.body;

  // Validate title
  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  if (typeof title !== 'string' || title.trim() === '') {
    res.status(400).json({ error: 'Title must be a non-empty string' });
    return;
  }

  if (title.length > 200) {
    res.status(400).json({ error: 'Title must not exceed 200 characters' });
    return;
  }

  // Validate description
  if (!description) {
    res.status(400).json({ error: 'Description is required' });
    return;
  }

  if (typeof description !== 'string' || description.trim() === '') {
    res.status(400).json({ error: 'Description must be a non-empty string' });
    return;
  }

  if (description.length > 1000) {
    res.status(400).json({ error: 'Description must not exceed 1000 characters' });
    return;
  }

  // Validate status (optional)
  if (status && !Object.values(TaskStatus).includes(status)) {
    res.status(400).json({ 
      error: 'Invalid status value. Must be one of: TODO, IN_PROGRESS, COMPLETED' 
    });
    return;
  }

  // Validate priority (optional)
  if (priority && !Object.values(TaskPriority).includes(priority)) {
    res.status(400).json({ 
      error: 'Invalid priority value. Must be one of: LOW, MEDIUM, HIGH' 
    });
    return;
  }

  // Validate dueDate (optional)
  if (dueDate) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      res.status(400).json({ error: 'Invalid due date format. Use ISO 8601 format (e.g., 2026-12-31)' });
      return;
    }
  }

  // Validate HIGH priority tasks must have due date within 7 days
  const taskPriority = priority || TaskPriority.MEDIUM;
  if (taskPriority === TaskPriority.HIGH) {
    if (!dueDate) {
      res.status(400).json({ error: 'High priority tasks must have a due date' });
      return;
    }

    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (dueDateObj > sevenDaysFromNow) {
      res.status(400).json({ 
        error: 'High priority tasks must have a due date within 7 days from today' 
      });
      return;
    }

    if (dueDateObj < today) {
      res.status(400).json({ error: 'Due date cannot be in the past' });
      return;
    }
  }

  next();
};

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, status, priority, dueDate } = req.body;

  // At least one field must be provided
  if (title === undefined && description === undefined && status === undefined && priority === undefined && dueDate === undefined) {
    res.status(400).json({ error: 'At least one field (title, description, status, priority, or dueDate) must be provided' });
    return;
  }

  // Validate title if provided
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ error: 'Title must be a non-empty string' });
      return;
    }

    if (title.length > 200) {
      res.status(400).json({ error: 'Title must not exceed 200 characters' });
      return;
    }
  }

  // Validate description if provided
  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      res.status(400).json({ error: 'Description must be a non-empty string' });
      return;
    }

    if (description.length > 1000) {
      res.status(400).json({ error: 'Description must not exceed 1000 characters' });
      return;
    }
  }

  // Validate status if provided
  if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
    res.status(400).json({ 
      error: 'Invalid status value. Must be one of: TODO, IN_PROGRESS, COMPLETED' 
    });
    return;
  }

  // Validate priority if provided
  if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
    res.status(400).json({ 
      error: 'Invalid priority value. Must be one of: LOW, MEDIUM, HIGH' 
    });
    return;
  }

  // Validate dueDate if provided
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      res.status(400).json({ error: 'Invalid due date format. Use ISO 8601 format (e.g., 2026-12-31)' });
      return;
    }
  }

  next();
};

export const validateTaskId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Task ID is required' });
    return;
  }

  // Basic UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    res.status(400).json({ error: 'Invalid task ID format' });
    return;
  }

  next();
};

export const validateHighPriorityConstraint = (req: Request, res: Response, next: NextFunction): void => {
  const { priority, dueDate } = req.body;

  // Only validate if priority is being changed to HIGH
  if (priority === TaskPriority.HIGH) {
    if (!dueDate) {
      res.status(400).json({ error: 'High priority tasks must have a due date' });
      return;
    }

    const dueDateObj = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    if (dueDateObj > sevenDaysFromNow) {
      res.status(400).json({ 
        error: 'High priority tasks must have a due date within 7 days from today' 
      });
      return;
    }

    if (dueDateObj < today) {
      res.status(400).json({ error: 'Due date cannot be in the past' });
      return;
    }
  }

  next();
};
