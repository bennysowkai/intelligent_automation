import dataStore from '../models/dataStore.js';

export const getAllSurveys = (req, res) => {
  try {
    const surveys = dataStore.getAll('surveys');
    res.json(surveys);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
};

export const getSurveyById = (req, res) => {
  try {
    const survey = dataStore.getById('surveys', req.params.id);
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    res.json(survey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch survey' });
  }
};

export const createSurvey = (req, res) => {
  try {
    const { projectName, respondentName, rating, comments } = req.body;

    if (!projectName || !respondentName || !rating) {
      return res.status(400).json({
        error: 'Project name, respondent name, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5'
      });
    }

    const newSurvey = dataStore.create('surveys', {
      projectName,
      respondentName,
      rating: parseInt(rating),
      comments: comments || '',
      date: new Date().toISOString().split('T')[0]
    });

    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create survey' });
  }
};

export const getSurveyStats = (req, res) => {
  try {
    const surveys = dataStore.getAll('surveys');

    const stats = {
      total: surveys.length,
      averageRating: surveys.length > 0
        ? (surveys.reduce((sum, s) => sum + s.rating, 0) / surveys.length).toFixed(2)
        : 0,
      ratingDistribution: {
        1: surveys.filter(s => s.rating === 1).length,
        2: surveys.filter(s => s.rating === 2).length,
        3: surveys.filter(s => s.rating === 3).length,
        4: surveys.filter(s => s.rating === 4).length,
        5: surveys.filter(s => s.rating === 5).length
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate survey stats' });
  }
};
