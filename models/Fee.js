const mongoose=require('mongoose');
const schema=new mongoose.Schema({studentId:{type:mongoose.Schema.Types.ObjectId,ref:'Student',required:true},month:String,amount:Number,dueDate:Date,paid:Boolean,paidDate:Date,method:String,transactionId:String,discount:Number,note:String},{timestamps:true}); module.exports=mongoose.model('Fee',schema);
