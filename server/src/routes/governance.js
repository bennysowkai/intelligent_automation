import express from 'express';
import {
  getAllGovernanceChecks,
  getGovernanceCheckById,
  createGovernanceCheck,
  updateGovernanceCheck,
  deleteGovernanceCheck
} from '../controllers/governanceController.js';

const router = express.Router();

router.get('/', getAllGovernanceChecks);
router.get('/:id', getGovernanceCheckById);
router.post('/', createGovernanceCheck);
router.put('/:id', updateGovernanceCheck);
router.delete('/:id', deleteGovernanceCheck);

export default router;
