import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true,select:false},totalScore:{type:Number,default:0},gamesPlayed:{type:Number,default:0},badges:[{type:String}],createdAt:{type:Date,default:Date.now}},{timestamps:true});
export default mongoose.model('User',schema);
