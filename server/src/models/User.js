import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  // Doctor profile (optional fields)
  specialization: { type: String },
  qualification: { type: String },
  experience: { type: Number },
  availability: [{ day: String, slots: [String] }],
  consultationFee: { type: Number },
  // Common profile extras
  phone: { type: String },
  address: { type: String },
  emergencyContact: { name: String, phone: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
