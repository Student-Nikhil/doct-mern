import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, select: false },
  age: Number,
  gender: { type: String, enum: ['', 'male', 'female', 'other'], default: '' },
  address: { type: String, default: '' },
  avatar: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('User', userSchema);
