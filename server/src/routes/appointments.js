import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { createAppointment, listMyAppointments, updateAppointment, cancelAppointment, validateCreate, validateUpdate, approveAppointment, rejectAppointment, rescheduleAppointment, validateReschedule, deleteAppointmentHard } from '../controllers/appointmentController.js';

const router = Router();

router.post('/', requireAuth, validateCreate, handleValidation, createAppointment);
router.get('/', requireAuth, listMyAppointments);
router.patch('/:id', requireAuth, validateUpdate, handleValidation, updateAppointment);
router.delete('/:id', requireAuth, cancelAppointment);
router.delete('/hard/:id', requireAuth, deleteAppointmentHard);

// Doctor actions
router.put('/approve/:id', requireAuth, requireRole('doctor'), approveAppointment);
router.put('/reject/:id', requireAuth, requireRole('doctor'), rejectAppointment);
router.put('/reschedule/:id', requireAuth, requireRole('doctor'), validateReschedule, handleValidation, rescheduleAppointment);

export default router;
