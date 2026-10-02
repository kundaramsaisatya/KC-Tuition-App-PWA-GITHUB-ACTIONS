const mongoose=require('mongoose');
const schema=new mongoose.Schema({
  title:{type:String,required:true},description:String,standard:{type:Number,enum:[9,10],required:true},subject:String,dueDate:Date,
  attachment:{originalName:String,fileName:String,filePath:String,mimeType:String,size:Number}
},{timestamps:true});
module.exports=mongoose.model('Homework',schema);
