import mongoose from 'mongoose';
export default mongoose.model('Appointment', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  illness: { type: String, required: true },
  comments: { type: String, default: '' },
  report: { type: String, default: '' },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true }));
