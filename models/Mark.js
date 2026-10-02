const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  testId:{type:mongoose.Schema.Types.ObjectId,ref:'Test'},
  studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student'},
  marks:Number,
  remark:String,
  published:{type:Boolean,default:false}
},{timestamps:true});
schema.index({testId:1,studentId:1},{unique:true});
module.exports=mongoose.model('Mark',schema);
