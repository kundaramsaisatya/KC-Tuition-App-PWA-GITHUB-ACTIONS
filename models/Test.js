const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  name:String,
  subject:String,
  standard:{type:Number,default:0},
  date:Date,
  totalMarks:Number,
  notes:String,
  type:{type:String,enum:['online','offline'],default:'offline'},
  questionPaper:{fileName:String,filePath:String,mimeType:String,size:Number},
  sourceExamId:{type:mongoose.Schema.Types.ObjectId,ref:'Exam',default:null}
},{timestamps:true});
module.exports=mongoose.model('Test',schema);
