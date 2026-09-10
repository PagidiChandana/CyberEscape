import mongoose from 'mongoose';
const answerSchema=new mongoose.Schema({question:{type:mongoose.Schema.Types.ObjectId,ref:'Question'},selectedAnswer:Number,correct:Boolean,topic:String,points:Number},{_id:false});
const schema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},level:{type:Number,required:true},answers:[answerSchema],score:{type:Number,default:0},maxScore:{type:Number,default:0},correctCount:{type:Number,default:0},livesStart:{type:Number,default:3},livesLeft:{type:Number,default:3},startedAt:{type:Date,default:Date.now},completedAt:Date,durationSeconds:Number,status:{type:String,enum:['active','completed','abandoned'],default:'active'}},{timestamps:true});
export default mongoose.model('GameSession',schema);
