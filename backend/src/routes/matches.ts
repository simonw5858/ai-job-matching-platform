import { Router } from 'express';
import { matchingController } from '../controllers/matchingController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All matching routes require authentication
router.use(authenticate);

router.get('/', (req, res) => matchingController.getMatches(req, res));
router.get('/job/:jobId', (req, res) => matchingController.getJobMatch(req, res));

export default router;
