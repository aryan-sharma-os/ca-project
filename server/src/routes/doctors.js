import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// Public doctor directory
router.get('/', async (req, res) => {
  const doctors = await User.find({ role: 'doctor' }).select('name email specialization qualification experience consultationFee');
  res.json(doctors);
});

router.get('/:id', async (req, res) => {
  const doctor = await User.findById(req.params.id).select('name email specialization qualification experience consultationFee availability');
  if (!doctor || doctor.role !== 'doctor') return res.status(404).json({ message: 'Not found' });
  res.json(doctor);
});

export default router;