import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { handleValidation } from '../middleware/validate.js';
import { createPrescription, listPrescriptions, validateCreatePrescription } from '../controllers/prescriptionController.js';

const router = Router();

router.post('/', requireAuth, requireRole('doctor'), validateCreatePrescription, handleValidation, createPrescription);
router.get('/', requireAuth, listPrescriptions);

export default router;
