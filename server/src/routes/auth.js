import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { register, login, me, logout, validateRegister, validateLogin } from '../controllers/authController.js';

const router = Router();

router.post('/register', validateRegister, handleValidation, register);
router.post('/login', validateLogin, handleValidation, login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;
