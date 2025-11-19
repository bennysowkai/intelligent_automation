import express from 'express';
import {
  getAllWorkItems,
  getWorkItemById,
  createWorkItem,
  updateWorkItem,
  deleteWorkItem
} from '../controllers/workItemController.js';

const router = express.Router();

router.get('/', getAllWorkItems);
router.get('/:id', getWorkItemById);
router.post('/', createWorkItem);
router.put('/:id', updateWorkItem);
router.delete('/:id', deleteWorkItem);

export default router;
