import dataStore from '../models/dataStore.js';

export const getAllDocTasks = (req, res) => {
  try {
    const docTasks = dataStore.getAll('docTasks');
    res.json(docTasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documentation tasks' });
  }
};

export const getDocTaskById = (req, res) => {
  try {
    const docTask = dataStore.getById('docTasks', req.params.id);
    if (!docTask) {
      return res.status(404).json({ error: 'Documentation task not found' });
    }
    res.json(docTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documentation task' });
  }
};

export const createDocTask = (req, res) => {
  try {
    const { title, description, automationId, status } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const newDocTask = dataStore.create('docTasks', {
      title,
      description: description || '',
      automationId: automationId || null,
      status: status || 'Draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0]
    });

    res.status(201).json(newDocTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create documentation task' });
  }
};

export const updateDocTask = (req, res) => {
  try {
    const updateData = {
      ...req.body,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    const updatedDocTask = dataStore.update('docTasks', req.params.id, updateData);
    if (!updatedDocTask) {
      return res.status(404).json({ error: 'Documentation task not found' });
    }
    res.json(updatedDocTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update documentation task' });
  }
};

export const deleteDocTask = (req, res) => {
  try {
    const deleted = dataStore.delete('docTasks', req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Documentation task not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete documentation task' });
  }
};

export const generateAISuggestion = (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        error: 'Title is required to generate AI suggestion'
      });
    }

    // Mock AI generation - in a real app, this would call an AI service
    const suggestion = `# ${title}

## Overview
${description || 'This automation streamlines business processes and improves efficiency.'}

## Purpose
This documentation provides a comprehensive guide for understanding and maintaining the automation.

## Key Features
- Automated workflow execution
- Error handling and logging
- Integration with existing systems
- User notification system

## Prerequisites
- Access to the automation environment
- Understanding of the business process
- Required permissions and credentials

## Configuration
1. Review environment variables
2. Configure connection references
3. Set up required permissions
4. Test in development environment

## Usage Instructions
1. Navigate to the automation interface
2. Review input requirements
3. Execute the automation
4. Monitor execution logs
5. Verify expected outcomes

## Troubleshooting
- Check error logs for detailed messages
- Verify all connections are active
- Ensure input data is properly formatted
- Contact support if issues persist

## Maintenance
- Regular review of automation performance
- Update documentation as changes occur
- Monitor for errors and exceptions
- Schedule periodic testing

## Support
For questions or issues, contact the Intelligent Automation team.
`;

    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI suggestion' });
  }
};
