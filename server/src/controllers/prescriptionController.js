import { body } from 'express-validator';
import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import { generatePrescriptionPDF } from '../utils/pdf.js';

export const validateCreatePrescription = [
  body('appointmentId').isString(),
  body('items').isArray(),
  body('notes').optional().isString(),
];

export async function createPrescription(req, res) {
  const { appointmentId, items, notes } = req.body;

  // Ensure appointment exists and belongs to the doctor creating the prescription
  const appt = await Appointment.findById(appointmentId).select('doctorId patientId');
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  if (String(appt.doctorId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Forbidden: appointment does not belong to doctor' });
  }

  const presc = await Prescription.create({
    appointmentId: appt._id,
    patientId: appt.patientId,
    doctorId: req.user.id,
    items,
    notes,
  });
  const pdfUrl = await generatePrescriptionPDF(presc);
  presc.pdfUrl = pdfUrl;
  await presc.save();
  res.status(201).json(presc);
}

export async function listPrescriptions(req, res) {
  const filter = req.user.role === 'doctor' ? { doctorId: req.user.id } : { patientId: req.user.id };
  const list = await Prescription.find(filter)
    .populate('doctorId', 'name')
    .populate('appointmentId', 'startTime endTime')
    .sort({ createdAt: -1 });
  res.json(list);
}
