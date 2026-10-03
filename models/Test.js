const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  name:String,
  subject:String,
  standard:{type:Number,default:0},
  date:Date,
  totalMarks:Number,
  notes:String,
<<<<<<< HEAD
  type:{type:String,enum:['online','offline'],default:'offline'},
  questionPaper:{fileName:String,filePath:String,mimeType:String,size:Number},
=======
>>>>>>> 0e60309c25b60260733da8668e400ab95383d17f
  sourceExamId:{type:mongoose.Schema.Types.ObjectId,ref:'Exam',default:null}
},{timestamps:true});
module.exports=mongoose.model('Test',schema);
