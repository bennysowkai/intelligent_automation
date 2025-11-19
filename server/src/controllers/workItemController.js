import dataStore from '../models/dataStore.js';

export const getAllWorkItems = (req, res) => {
  try {
    const workItems = dataStore.getAll('workItems');
    res.json(workItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work items' });
  }
};

export const getWorkItemById = (req, res) => {
  try {
    const workItem = dataStore.getById('workItems', req.params.id);
    if (!workItem) {
      return res.status(404).json({ error: 'Work item not found' });
    }
    res.json(workItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work item' });
  }
};

export const createWorkItem = (req, res) => {
  try {
    const { name, businessOwner, status, priority, targetGoLiveDate } = req.body;

    if (!name || !businessOwner) {
      return res.status(400).json({
        error: 'Name and business owner are required'
      });
    }

    const newWorkItem = dataStore.create('workItems', {
      name,
      businessOwner,
      status: status || 'Idea',
      priority: priority || 'Medium',
      createdDate: new Date().toISOString().split('T')[0],
      targetGoLiveDate: targetGoLiveDate || null,
      actualGoLiveDate: null
    });

    res.status(201).json(newWorkItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work item' });
  }
};

export const updateWorkItem = (req, res) => {
  try {
    const updatedWorkItem = dataStore.update('workItems', req.params.id, req.body);
    if (!updatedWorkItem) {
      return res.status(404).json({ error: 'Work item not found' });
    }
    res.json(updatedWorkItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update work item' });
  }
};

export const deleteWorkItem = (req, res) => {
  try {
    const deleted = dataStore.delete('workItems', req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Work item not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete work item' });
  }
};
