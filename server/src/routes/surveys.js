import express from 'express';
import {
  getAllSurveys,
  getSurveyById,
  createSurvey,
  getSurveyStats
} from '../controllers/surveyController.js';

const router = express.Router();

router.get('/', getAllSurveys);
router.get('/stats', getSurveyStats);
router.get('/:id', getSurveyById);
router.post('/', createSurvey);

export default router;
