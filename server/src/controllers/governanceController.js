import dataStore from '../models/dataStore.js';

export const getAllGovernanceChecks = (req, res) => {
  try {
    const checks = dataStore.getAll('governanceChecks');
    res.json(checks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch governance checks' });
  }
};

export const getGovernanceCheckById = (req, res) => {
  try {
    const check = dataStore.getById('governanceChecks', req.params.id);
    if (!check) {
      return res.status(404).json({ error: 'Governance check not found' });
    }
    res.json(check);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch governance check' });
  }
};

export const createGovernanceCheck = (req, res) => {
  try {
    const { name, description, type, status } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: 'Name and type are required'
      });
    }

    const newCheck = dataStore.create('governanceChecks', {
      name,
      description: description || '',
      type,
      status: status || 'Not Started',
      createdDate: new Date().toISOString().split('T')[0],
      lastReviewDate: null
    });

    res.status(201).json(newCheck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create governance check' });
  }
};

export const updateGovernanceCheck = (req, res) => {
  try {
    const updateData = {
      ...req.body,
      lastReviewDate: new Date().toISOString().split('T')[0]
    };

    const updatedCheck = dataStore.update('governanceChecks', req.params.id, updateData);
    if (!updatedCheck) {
      return res.status(404).json({ error: 'Governance check not found' });
    }
    res.json(updatedCheck);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update governance check' });
  }
};

export const deleteGovernanceCheck = (req, res) => {
  try {
    const deleted = dataStore.delete('governanceChecks', req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Governance check not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete governance check' });
  }
};
