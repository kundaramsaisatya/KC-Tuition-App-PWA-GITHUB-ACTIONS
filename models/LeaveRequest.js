const mongoose=require('mongoose');
const schema=new mongoose.Schema({studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},from:Date,to:Date,reason:String,status:{type:String,enum:['pending','approved','rejected'],default:'pending'},teacherNote:String},{timestamps:true}); module.exports=mongoose.model('LeaveRequest',schema);
