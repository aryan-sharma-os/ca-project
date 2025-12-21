import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidation } from '../middleware/validate.js';
import User from '../models/User.js';

const router = Router();

// Current doctor profile
router.get('/profile', requireAuth, requireRole('doctor'), async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
});

const validateDoctorProfile = [
  body('specialization').optional().isString(),
  body('qualification').optional().isString(),
  body('experience').optional().isInt({ min: 0 }),
  body('availability').optional().isArray(),
  body('consultationFee').optional().isFloat({ min: 0 }),
  body('phone').optional().isString(),
  body('address').optional().isString()
];

router.put('/profile', requireAuth, requireRole('doctor'), validateDoctorProfile, handleValidation, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-passwordHash');
  res.json(user);
});

export default router;