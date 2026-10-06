const Notification=require('../models/Notification');

async function notifyStudent(student,{type,title,body}){
  if(!student) return;
  const channels=['in_app'];
  await Notification.create({studentId:student._id,type,title,body,channels});

  const email=student.parentEmail||student.studentEmail;
  if(email && process.env.RESEND_API_KEY && process.env.NOTIFY_FROM_EMAIL){
    try{
      const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.NOTIFY_FROM_EMAIL,to:[email],subject:title,html:`<p>${escapeHtml(body)}</p>`})});
      if(r.ok) channels.push('email');
    }catch(e){console.error('Email notification failed:',e.message)}
  }
  if(student.parentPhone && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER){
    try{
      const auth=Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const params=new URLSearchParams({To:student.parentPhone,From:process.env.TWILIO_FROM_NUMBER,Body:`${title}: ${body}`});
      const r=await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/x-www-form-urlencoded'},body:params});
      if(r.ok) channels.push('sms');
    }catch(e){console.error('SMS notification failed:',e.message)}
  }
  await Notification.updateOne({studentId:student._id,type,title,body},{channels,sentAt:new Date()});
}
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
module.exports={notifyStudent};
