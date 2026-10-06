const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},
  sender:{type:String,enum:['student','teacher'],required:true},
  text:{type:String,default:''},
  attachment:{originalName:String,fileName:String,filePath:String,mimeType:String,size:Number},
  readAt:Date
},{timestamps:true});
module.exports=mongoose.model('Message',schema);
