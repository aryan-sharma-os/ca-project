import { body } from 'express-validator';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import Appointment from '../models/Appointment.js';
import AuditLog from '../models/AuditLog.js';

export const validateCreate = [
  body('doctorId').isString(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('consentGiven').isBoolean()
];

export async function createAppointment(req, res) {
  const { doctorId, startTime, endTime, consentGiven } = req.body;
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  if (!end.isAfter(start)) return res.status(400).json({ message: 'End must be after start' });
  const roomId = uuidv4();
  const appt = await Appointment.create({
    patientId: req.user.id,
    doctorId,
    startTime: start.toDate(),
    endTime: end.toDate(),
    consentGiven,
    roomId
  });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_create', ip: req.ip });
  res.status(201).json(appt);
}

export async function listMyAppointments(req, res) {
  const filter = req.user.role === 'doctor' ? { doctorId: req.user.id } : { patientId: req.user.id };
  const appts = await Appointment.find(filter).sort({ startTime: 1 });
  res.json(appts);
}

export const validateUpdate = [
  body('status').optional().isIn(['scheduled', 'completed', 'cancelled'])
];

export async function updateAppointment(req, res) {
  const { id } = req.params;
  const appt = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found' });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_update', ip: req.ip });
  res.json(appt);
}

export async function cancelAppointment(req, res) {
  const { id } = req.params;
  const appt = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found' });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_cancel', ip: req.ip });
  res.json(appt);
}

export async function approveAppointment(req, res) {
  const { id } = req.params;
  const appt = await Appointment.findOneAndUpdate({ _id: id, doctorId: req.user.id }, { status: 'scheduled' }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found or unauthorized' });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_approve', ip: req.ip });
  res.json(appt);
}

export async function rejectAppointment(req, res) {
  const { id } = req.params;
  const appt = await Appointment.findOneAndUpdate({ _id: id, doctorId: req.user.id }, { status: 'cancelled' }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found or unauthorized' });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_reject', ip: req.ip });
  res.json(appt);
}

export const validateReschedule = [
  body('startTime').isISO8601(),
  body('endTime').isISO8601()
];

export async function rescheduleAppointment(req, res) {
  const { id } = req.params;
  const { startTime, endTime } = req.body;
  const appt = await Appointment.findOneAndUpdate({ _id: id, doctorId: req.user.id }, { startTime, endTime }, { new: true });
  if (!appt) return res.status(404).json({ message: 'Not found or unauthorized' });
  await AuditLog.create({ userId: req.user.id, action: 'appointment_reschedule', ip: req.ip });
  res.json(appt);
}
