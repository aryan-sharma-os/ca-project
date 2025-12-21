import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String
  }],
  notes: String,
  pdfUrl: String
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
