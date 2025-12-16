import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.put('/skills', (req, res) => userController.updateSkills(req, res));

export default router;
