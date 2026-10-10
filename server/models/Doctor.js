import mongoose from 'mongoose';
export default mongoose.model('Doctor', new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  treats: [String],
  experience: Number,
  fee: Number,
  rating: Number,
  about: String,
  image: String,
  slots: [String]
}));
