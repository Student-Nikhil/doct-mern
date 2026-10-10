import mongoose from 'mongoose';
export default mongoose.model('Service', new mongoose.Schema({
  title: String, description: String, icon: String, specialty: String
}));
