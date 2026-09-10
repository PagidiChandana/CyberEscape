import mongoose from 'mongoose';
const schema=new mongoose.Schema({level:{type:Number,required:true,min:1,max:5},title:String,scenario:String,topic:{type:String,required:true},challenge:{type:String,enum:['phishing','password','qr','scam','other'],default:'other'},question:{type:String,required:true},options:[String],correctAnswer:{type:Number,required:true},explanation:String,difficulty:{type:String,enum:['easy','medium','hard'],default:'medium'},points:{type:Number,default:100}},{timestamps:true});
export default mongoose.model('Question',schema);
