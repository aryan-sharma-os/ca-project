import { body } from 'express-validator';
import Prescription from '../models/Prescription.js';
import { generatePrescriptionPDF } from '../utils/pdf.js';

export const validateCreatePrescription = [
  body('appointmentId').isString(),
  body('patientId').isString(),
  body('items').isArray(),
];

export async function createPrescription(req, res) {
  const { appointmentId, patientId, items, notes } = req.body;
  const presc = await Prescription.create({
    appointmentId,
    patientId,
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
  const list = await Prescription.find(filter).sort({ createdAt: -1 });
  res.json(list);
}
