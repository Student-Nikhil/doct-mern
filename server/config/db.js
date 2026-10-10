import mongoose from 'mongoose';
export default async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careloop');
  console.log('MongoDB connected');
}
