const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  title:{type:String,required:true},
  standard:{type:Number,enum:[0,9,10],required:true},
  subject:{type:String,default:''},
  duration:{type:Number,default:60},
  sourceFile:String,
  paperCount:Number,
  assignedStudents:[{type:mongoose.Schema.Types.ObjectId,ref:'Student'}],
  createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model('Exam',schema);
