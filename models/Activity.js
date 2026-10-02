const mongoose=require('mongoose');
const schema=new mongoose.Schema({studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student'},action:String,details:String,ip:String,userAgent:String},{timestamps:true});
module.exports=mongoose.model('Activity',schema);
