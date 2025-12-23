import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { body } from 'express-validator';
import { handleValidation } from '../middleware/validate.js';
import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

const router = Router();

// Appointments
router.get('/appointments', requireAuth, requireRole('admin'), async (req, res) => {
  const list = await Appointment.find()
    .sort({ startTime: -1 })
    .populate('doctorId', 'name email')
    .populate('patientId', 'name email');
  res.json(list);
});

const validateAdminUpdateAppointment = [
  body('status').optional().isIn(['requested','scheduled','completed','cancelled']),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('notes').optional().isString()
];

router.patch('/appointments/:id', requireAuth, requireRole('admin'), validateAdminUpdateAppointment, handleValidation, async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found' });
  await AuditLog.create({ userId: req.user.id, action: 'admin_appointment_update', ip: req.ip });
  res.json(appt);
});

router.delete('/appointments/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const ok = await Appointment.deleteOne({ _id: req.params.id });
  await AuditLog.create({ userId: req.user.id, action: 'admin_appointment_delete', ip: req.ip });
  res.json({ _id: req.params.id, deleted: ok.deletedCount === 1 });
});

// Prescriptions
router.get('/prescriptions', requireAuth, requireRole('admin'), async (req, res) => {
  const list = await Prescription.find()
    .sort({ createdAt: -1 })
    .populate('doctorId', 'name email')
    .populate('patientId', 'name email')
    .populate('appointmentId', 'startTime endTime');
  res.json(list);
});

router.delete('/prescriptions/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const ok = await Prescription.deleteOne({ _id: req.params.id });
  await AuditLog.create({ userId: req.user.id, action: 'admin_prescription_delete', ip: req.ip });
  res.json({ _id: req.params.id, deleted: ok.deletedCount === 1 });
});

// Users
router.get('/users', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

const validateAdminUpdateUser = [
  body('role').optional().isIn(['patient','doctor','admin']),
  body('name').optional().isString(),
  body('phone').optional().isString(),
  body('address').optional().isString(),
  body('specialization').optional().isString(),
  body('qualification').optional().isString(),
  body('experience').optional().isInt({ min: 0 }),
  body('consultationFee').optional().isFloat({ min: 0 })
];

router.patch('/users/:id', requireAuth, requireRole('admin'), validateAdminUpdateUser, handleValidation, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'Not found' });
  await AuditLog.create({ userId: req.user.id, action: 'admin_user_update', ip: req.ip });
  res.json(user);
});

router.delete('/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const ok = await User.deleteOne({ _id: req.params.id });
  await AuditLog.create({ userId: req.user.id, action: 'admin_user_delete', ip: req.ip });
  res.json({ _id: req.params.id, deleted: ok.deletedCount === 1 });
});

// Audit logs
router.get('/audit', requireAuth, requireRole('admin'), async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).populate('userId', 'name email role');
  res.json(logs);
});

export default router;
