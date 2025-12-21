import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { listMessages, validateSendMessage } from '../controllers/chatController.js';
import Appointment from '../models/Appointment.js';

const router = Router();

router.get('/messages', requireAuth, listMessages);
router.post('/messages', requireAuth, validateSendMessage, handleValidation, (req, res) => {
  // Messages are primarily handled via Socket.IO; optional REST hook could be implemented.
  res.status(501).json({ message: 'Use Socket.IO for chat' });
});

// Consultation start: ensure roomId exists and return it
router.post('/start', requireAuth, async (req, res) => {
  const { appointmentId } = req.body;
  const appt = await Appointment.findById(appointmentId);
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  // Simple authorization: doctor or patient involved
  if (String(appt.patientId) !== req.user.id && String(appt.doctorId) !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json({ roomId: appt.roomId });
});

// Consultation notes
router.post('/notes', requireAuth, async (req, res) => {
  const { appointmentId, notes } = req.body;
  const appt = await Appointment.findOneAndUpdate({ _id: appointmentId, doctorId: req.user.id }, { notes }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found or unauthorized' });
  res.json({ message: 'Saved', notes: appt.notes });
});

export default router;
