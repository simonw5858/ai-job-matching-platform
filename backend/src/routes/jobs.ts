import { Router } from 'express';
import { jobController } from '../controllers/jobController';
import { authenticate, requireRecruiter } from '../middleware/auth';

const router = Router();

// All job routes require authentication
router.use(authenticate);

// Public job routes (authenticated users)
router.get('/', (req, res) => jobController.getAllJobs(req, res));
router.get('/:id', (req, res) => jobController.getJobById(req, res));

// Recruiter-only routes
router.post('/', requireRecruiter, (req, res) => jobController.createJob(req, res));
router.get('/my/jobs', requireRecruiter, (req, res) => jobController.getMyJobs(req, res));
router.put('/:id', requireRecruiter, (req, res) => jobController.updateJob(req, res));
router.delete('/:id', requireRecruiter, (req, res) => jobController.deleteJob(req, res));

export default router;
