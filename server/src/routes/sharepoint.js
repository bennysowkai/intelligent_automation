import express from 'express';
import {
  listSites,
  getSiteById,
  getSiteContent,
  getGraphConfig
} from '../controllers/sharepointController.js';

const router = express.Router();

router.get('/sites', listSites);
router.get('/sites/:id', getSiteById);
router.get('/sites/:id/content', getSiteContent);
router.get('/config', getGraphConfig);

export default router;
