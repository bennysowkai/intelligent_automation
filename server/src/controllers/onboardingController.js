import dataStore from '../models/dataStore.js';

export const getAllTasks = (req, res) => {
  try {
    const tasks = dataStore.getAll('onboardingTasks');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch onboarding tasks' });
  }
};

export const getTaskById = (req, res) => {
  try {
    const task = dataStore.getById('onboardingTasks', req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const createTask = (req, res) => {
  try {
    const { title, description, category, status, assignee, dueDate } = req.body;

    if (!title || !category || !assignee) {
      return res.status(400).json({
        error: 'Title, category, and assignee are required'
      });
    }

    const newTask = dataStore.create('onboardingTasks', {
      title,
      description: description || '',
      category,
      status: status || 'Pending',
      assignee,
      dueDate: dueDate || null,
      createdDate: new Date().toISOString().split('T')[0]
    });

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const updateTask = (req, res) => {
  try {
    const updatedTask = dataStore.update('onboardingTasks', req.params.id, req.body);
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = (req, res) => {
  try {
    const deleted = dataStore.delete('onboardingTasks', req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
