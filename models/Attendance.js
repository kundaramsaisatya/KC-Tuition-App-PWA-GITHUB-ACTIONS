const mongoose=require('mongoose');
const schema=new mongoose.Schema({studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},date:{type:Date,required:true},status:{type:String,enum:['present','absent','late','leave'],required:true},note:String},{timestamps:true});
schema.index({studentId:1,date:1},{unique:true}); module.exports=mongoose.model('Attendance',schema);
