const mongoose=require('mongoose');
const schema=new mongoose.Schema({studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},fileName:{type:String,required:true},filePath:{type:String,required:true},startedAt:Date,uploadedAt:{type:Date,default:Date.now},size:Number,durationSeconds:Number,flagged:{type:Boolean,default:false},deletedAt:Date},{timestamps:true});
module.exports=mongoose.model('ExamRecording',schema);
