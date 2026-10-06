const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},
  type:{type:String,required:true},title:String,body:String,
  channels:{type:[String],default:['in_app']},sentAt:Date,readAt:Date,metadata:mongoose.Schema.Types.Mixed
},{timestamps:true});
schema.index({studentId:1,createdAt:-1});
module.exports=mongoose.model('Notification',schema);
