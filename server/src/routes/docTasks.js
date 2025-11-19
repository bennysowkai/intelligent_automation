import express from 'express';
import {
  getAllDocTasks,
  getDocTaskById,
  createDocTask,
  updateDocTask,
  deleteDocTask,
  generateAISuggestion
} from '../controllers/docTaskController.js';

const router = express.Router();

router.get('/', getAllDocTasks);
router.get('/:id', getDocTaskById);
router.post('/', createDocTask);
router.put('/:id', updateDocTask);
router.delete('/:id', deleteDocTask);
router.post('/ai-suggestion', generateAISuggestion);

export default router;
