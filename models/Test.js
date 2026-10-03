const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  name:String,
  subject:String,
  standard:{type:Number,default:0},
  date:Date,
  totalMarks:Number,
  notes:String,
  testType:{type:String,enum:['online','offline'],default:'online'},
  attachment:{
    fileName:String,
    originalName:String,
    mimeType:String,
    filePath:String
  },
  sourceExamId:{type:mongoose.Schema.Types.ObjectId,ref:'Exam',default:null}
},{timestamps:true});
module.exports=mongoose.model('Test',schema);
