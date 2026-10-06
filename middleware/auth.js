const Student=require('../models/Student'); const Activity=require('../models/Activity');
async function studentAuth(req,res,next){if(!req.session.studentId)return res.redirect('/login');const s=await Student.findById(req.session.studentId);if(!s||s.activeSessionId!==req.sessionID){return req.session.destroy(()=>res.redirect('/login?error=session'));}s.lastSeenAt=new Date();await s.save();req.student=s;res.locals.student=s;if(req.method==='GET'&&!req.path.startsWith('/homework/')&&!req.path.startsWith('/student/notifications')){await logActivity(req,'route_view',req.path);}next();}
function teacherAuth(req,res,next){if(!req.session.teacher)return res.redirect('/teacher/login');next();}
async function logActivity(req,action,details=''){if(req.student)await Activity.create({studentId:req.student._id,action,details,ip:req.ip,userAgent:(typeof req.get==='function'?req.get('user-agent'):req.headers?.['user-agent'])||''});}
module.exports={studentAuth,teacherAuth,logActivity};
