const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  homeworkId:{type:mongoose.Schema.Types.ObjectId,ref:'Homework',required:true},
  studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},
  status:{type:String,enum:['not_done','done'],default:'not_done'},
  note:{type:String,default:''},
  completedAt:Date,
  viewedAt:Date
},{timestamps:true});
schema.index({homeworkId:1,studentId:1},{unique:true});
module.exports=mongoose.model('HomeworkSubmission',schema);
