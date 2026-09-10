import mongoose from 'mongoose';
export default async function connectDB(){
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set. Copy .env.example to .env first.');
  try { await mongoose.connect(uri); console.log('MongoDB connected'); }
  catch(e){ console.error('MongoDB connection failed:',e.message); throw e; }
}
