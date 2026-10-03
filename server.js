require('dotenv').config();
const express=require('express'),mongoose=require('mongoose'),session=require('express-session'),MongoStore=require('connect-mongo'),rateLimit=require('express-rate-limit'),path=require('path'),bcrypt=require('bcryptjs');
const Student=require('./models/Student'),Activity=require('./models/Activity'),Attendance=require('./models/Attendance'),LeaveRequest=require('./models/LeaveRequest'),Fee=require('./models/Fee'),Test=require('./models/Test'),Mark=require('./models/Mark'),Announcement=require('./models/Announcement'),ClassSession=require('./models/ClassSession'),Homework=require('./models/Homework'),ExamRecording=require('./models/ExamRecording'),Exam=require('./models/Exam');
const {studentAuth,teacherAuth,logActivity}=require('./middleware/auth'); const questions=require('./data/questions'); const fs=require('fs'); const fsp=fs.promises; const multer=require('multer'); const recordingsDir=path.join(__dirname,'recordings'); const homeworkDir=path.join(__dirname,'storage','homework'); const testPaperDir=path.join(__dirname,'storage','test-papers'); fs.mkdirSync(recordingsDir,{recursive:true}); fs.mkdirSync(homeworkDir,{recursive:true}); fs.mkdirSync(testPaperDir,{recursive:true}); const testPaperUpload=multer({storage:multer.diskStorage({destination:(_,__,cb)=>cb(null,testPaperDir),filename:(_,file,cb)=>cb(null,`${Date.now()}-${Math.random().toString(36).slice(2,9)}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_')}`)}),limits:{fileSize:15*1024*1024},fileFilter:(_,file,cb)=>{const ok=file.mimetype==='application/pdf'||/\.pdf$/i.test(file.originalname||'');cb(ok?null:new Error('Only PDF files are allowed'),ok)}}); const testUpload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024},fileFilter:(_,file,cb)=>{const ok=['application/json','text/plain','application/octet-stream'].includes(file.mimetype)||/\.json$/i.test(file.originalname||'');cb(ok?null:new Error('Only JSON test files are allowed'),ok)}}); const homeworkUpload=multer({storage:multer.diskStorage({destination:(_,__,cb)=>cb(null,homeworkDir),filename:(_,file,cb)=>cb(null,`${Date.now()}-${Math.random().toString(36).slice(2,9)}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_')}`)}),limits:{fileSize:25*1024*1024},fileFilter:(_,file,cb)=>{const ok=['application/pdf','image/jpeg','image/png','image/webp','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype);cb(ok?null:new Error('Only PDF, DOC, DOCX, JPG, PNG and WEBP files are allowed'),ok)}});

const app=express(),PORT=process.env.PORT||3000,EXAM_MINUTES=Number(process.env.EXAM_MINUTES||60);app.set('view engine','ejs');app.set('views',path.join(__dirname,'views'));app.use(express.urlencoded({extended:true}));
app.use(express.json());app.use(express.static(path.join(__dirname,'public')));app.use(rateLimit({windowMs:900000,max:500}));
app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'kc-tuition-session-secret',
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
app.post('/exam/recording',studentAuth,express.raw({type:['video/webm','video/webm;codecs=vp8','video/webm;codecs=vp9'],limit:'500mb'}),async(req,res)=>{try{if(!req.student.examStartedAt||req.student.examSubmittedAt)return res.status(400).json({error:'Exam is not active'});if(!req.body||!req.body.length)return res.status(400).json({error:'Empty recording'});const dir=path.join(recordingsDir,String(req.student._id));await fsp.mkdir(dir,{recursive:true});const fileName=`${Date.now()}-${req.student.paperCode}.webm`;const filePath=path.join(dir,fileName);await fsp.writeFile(filePath,req.body);const rec=await ExamRecording.create({studentId:req.student._id,fileName,filePath,startedAt:req.student.examStartedAt,size:req.body.length});await logActivity(req,'exam_video_uploaded',`Recording ${rec._id} uploaded (${req.body.length} bytes)`);res.json({ok:true,recordingId:rec._id});}catch(e){console.error(e);res.status(500).json({error:'Recording upload failed'});}});
app.use((req,res,next)=>{res.locals.teacherName=process.env.TEACHER_NAME||'Kundaram Chandrakala';next();});
async function ensureDefaultStudents(){
  const rows=[
    ['S01','Shravya',9,'shravya01','Shravya@123'],
    ['N02','Nihansa',9,'nihansa01','Nihansa@123'],
    ['V03','Varshita',9,'varshita01','Varshita@123'],
    ['D04','Dhristi',9,'dhristi01','Dhristi@123'],
    ['A05','Anandi',10,'anandi01','Anandi@123'],
    ['A06','Akshara',10,'akshara01','Akshara@123'],
    ['R07','Rishabh',10,'rishabh01','Rishabh@123'],
    ['R08','Riya',10,'riya01','Riya@123']
  ];
  let created=0;
  for(const [id,name,std,user,pwd] of rows){
    const exists=await Student.findOne({$or:[{studentId:id},{username:user}]}).select('_id').lean();
    if(exists) continue;
    await Student.create({
      studentId:id,
      name,
      standard:std,
      username:user,
      passwordHash:await bcrypt.hash(pwd,12),
      paperCode:id,
      status:'active'
    });
    created++;
  }
  if(created) console.log(`Auto-seeded ${created} default student account(s).`);
}

function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function getExamSet(s){if(Array.isArray(s.assignedExamQuestions)&&s.assignedExamQuestions.length){return {title:s.assignedExamTitle||'Online Grammar Test',questions:s.assignedExamQuestions,duration:Number(s.assignedExamDuration||EXAM_MINUTES)}}return null;}
function examState(s){const started=!!s.examStartedAt,submitted=!!s.examSubmittedAt,expired=started&&!submitted&&s.examDeadline&&new Date(s.examDeadline)<=new Date();return{started,submitted,expired,remaining:started&&!submitted?Math.max(0,new Date(s.examDeadline)-Date.now()):0};}
function publicQuestion(q){if(!q)return null;const out={id:q.id,type:q.type,text:q.text,instruction:q.instruction,marks:q.marks,difficulty:q.difficulty};if(Array.isArray(q.subquestions))out.subquestions=q.subquestions.map(x=>({type:x.type,prompt:x.prompt,marks:x.marks}));return out;}
app.get('/',(req,res)=>res.redirect(req.session.studentId?'/student':'/login'));app.get('/login',(req,res)=>res.render('login',{error:req.query.error}));
app.post('/login',async(req,res)=>{const s=await Student.findOne({username:req.body.username});if(!s||s.status!=='active'||!(await bcrypt.compare(req.body.password,s.passwordHash)))return res.render('login',{error:'Invalid username or password'});req.session.regenerate(async err=>{if(err)return res.status(500).send('Login error');req.session.studentId=s._id.toString();s.activeSessionId=req.sessionID;s.lastLoginAt=new Date();await s.save();req.student=s;await logActivity(req,'login');res.redirect('/student');});});
app.post('/logout',studentAuth,async(req,res)=>{await logActivity(req,'logout');await Student.findByIdAndUpdate(req.student._id,{activeSessionId:null});req.session.destroy(()=>res.redirect('/login'))});
app.get('/student',studentAuth,async(req,res)=>{const [attendance,fees,leaves,tests,marks,announcements,homeworks,classes]=await Promise.all([Attendance.find({studentId:req.student._id}).sort({date:-1}).limit(100).lean(),Fee.find({studentId:req.student._id}).sort({dueDate:-1}).limit(24).lean(),LeaveRequest.find({studentId:req.student._id}).sort({createdAt:-1}).limit(10).lean(),Test.find({$or:[{standard:req.student.standard},{sourceExamId:req.student.assignedExamId}]}).sort({date:-1}).limit(10).lean(),Mark.find({studentId:req.student._id,published:true}).populate('testId').sort({createdAt:-1}).limit(10).lean(),Announcement.find({$or:[{audience:'all'},{audience:req.student.standard===9?'std9':'std10'}]}).sort({createdAt:-1}).limit(10).lean(),Homework.find({standard:req.student.standard}).sort({dueDate:-1}).limit(10).lean(),ClassSession.find({standard:req.student.standard}).sort({date:1}).limit(20).lean()]);res.render('student',{student:req.student,attendance,fees,leaves,tests,marks,announcements,homeworks,classes});});
app.get('/exam',studentAuth,async(req,res)=>{const set=getExamSet(req.student);if(!set)return res.redirect('/student#tests');const st=examState(req.student);if(st.expired){req.student.examSubmittedAt=new Date();await req.student.save();}res.render('exam',{set,student:req.student,state:examState(req.student),examMinutes:set.duration});});
async function startExam(req,res){const set=getExamSet(req.student);if(!set)return res.redirect('/student#tests');if(req.student.examStartedAt&&!req.student.examSubmittedAt)return res.redirect('/exam');if(req.student.examSubmittedAt)return res.redirect('/exam');req.student.examStartedAt=new Date();req.student.examDeadline=new Date(Date.now()+set.duration*60000);req.student.examOrder=shuffle(set.questions.map((_,i)=>i));req.student.examAnswers=new Map();req.student.examQuestionIndex=0;req.student.examSubmittedAt=null;await req.student.save();await logActivity(req,'exam_start',`${set.title} · ${set.duration} minutes`);res.redirect('/exam');} app.get('/exam/start',studentAuth,startExam);app.post('/exam/start',studentAuth,startExam);
app.get('/exam/question',studentAuth,async(req,res)=>{const st=examState(req.student),set=getExamSet(req.student);if(!set||!st.started||st.submitted||st.expired)return res.json({submitted:true});const i=Math.max(0,Math.min(set.questions.length-1,Number(req.query.index)||0)),qi=req.student.examOrder[i];res.json({index:i,total:set.questions.length,question:publicQuestion(set.questions[qi]),answer:req.student.examAnswers?.get(String(qi))||'',remaining:st.remaining});});
app.post('/exam/answer',studentAuth,async(req,res)=>{const st=examState(req.student),set=getExamSet(req.student),i=Number(req.body.index);if(!set||!st.started||st.submitted||st.expired||i<0||i>=set.questions.length)return res.status(400).json({error:'Exam not active'});req.student.examAnswers.set(String(req.student.examOrder[i]),String(req.body.answer||'').slice(0,5000));req.student.examQuestionIndex=i;await req.student.save();res.json({ok:true});});
app.post('/exam/submit',studentAuth,async(req,res)=>{if(!req.student.examSubmittedAt){req.student.examSubmittedAt=new Date();await req.student.save();await logActivity(req,'exam_submit',req.student.assignedExamTitle||'Exam submitted');}res.redirect('/student');});
app.post('/homework-status',studentAuth,async(req,res)=>{req.student.homeworkStatus=req.body.status==='done'?'done':'not_done';req.student.homeworkNote=String(req.body.note||'').slice(0,500);await req.student.save();res.redirect('/student');});
app.post('/leave',studentAuth,async(req,res)=>{await LeaveRequest.create({studentId:req.student._id,from:new Date(req.body.from),to:new Date(req.body.to),reason:String(req.body.reason||'').slice(0,500)});res.redirect('/student');});
app.post('/client-event',studentAuth,async(req,res)=>{const allowed=['print_attempt','copy_attempt','visibility_hidden','devtools_hint','camera_denied','camera_granted','camera_stopped','fullscreen_exit','paste_attempt','right_click_attempt'];if(allowed.includes(req.body.action)){await logActivity(req,req.body.action,String(req.body.details||'').slice(0,300));if(req.body.action==='camera_granted'){req.student.cameraGranted=true;await req.student.save();}}res.json({ok:true});});
app.get('/teacher/login',(req,res)=>res.render('teacher-login',{error:req.query.error}));app.post('/teacher/login',(req,res)=>{if(req.body.username===process.env.TEACHER_USERNAME&&req.body.password===process.env.TEACHER_PASSWORD){req.session.teacher=true;return res.redirect('/teacher');}res.render('teacher-login',{error:'Invalid teacher login'});});app.post('/teacher/logout',(req,res)=>req.session.destroy(()=>res.redirect('/teacher/login')));
app.post('/teacher/exam/import',teacherAuth,testUpload.single('testFile'),async(req,res)=>{
  try{
    if(!req.file)return res.redirect('/teacher#tests');
    const data=JSON.parse(req.file.buffer.toString('utf8'));
    if(!data.title||(!Array.isArray(data.papers)&&(!data.papers||typeof data.papers!=='object')))throw new Error('Invalid test file: title and papers are required');
    const papers=Array.isArray(data.papers)?data.papers:Object.values(data.papers);
    if(!papers.length)throw new Error('Invalid test file: no papers found');
    const duration=Number(data.duration||60);
    if(!Number.isFinite(duration)||duration<5||duration>240)throw new Error('Invalid duration');
    const assigned=[];
    for(const paper of papers){
      if(!paper.studentUsername||![9,10].includes(Number(paper.standard))||!Array.isArray(paper.questions)||paper.questions.length!==20)throw new Error('Each paper needs studentUsername, standard and exactly 20 questions');
      const direct=paper.questions.filter(q=>q.type==='direct_to_indirect').length;
      const grammar=paper.questions.filter(q=>q.type==='grammar_mix').length;
      if(direct!==10||grammar!==10)throw new Error(`Paper ${paper.studentUsername} must contain 10 direct-to-indirect and 10 grammar questions`);
      if(paper.questions.some(q=>q.type==='grammar_mix'&&(!Array.isArray(q.subquestions)||q.subquestions.length!==4)))throw new Error(`Grammar questions for ${paper.studentUsername} must have 4 subquestions`);
      const student=await Student.findOne({username:String(paper.studentUsername).trim(),standard:Number(paper.standard)});
      if(!student)throw new Error(`Student not found: ${paper.studentUsername}`);
      if(student.examStartedAt&&!student.examSubmittedAt)throw new Error(`${student.name} currently has an active exam`);
      assigned.push(student);
    }
    const title=String(data.title).trim();
    const previousExams=await Exam.find({title}).lean();
    for(const oldExam of previousExams){
      const oldTests=await Test.find({sourceExamId:oldExam._id}).select('_id').lean();
      const oldTestIds=oldTests.map(t=>t._id);
      if(oldTestIds.length)await Mark.deleteMany({testId:{$in:oldTestIds}});
      await Test.deleteMany({sourceExamId:oldExam._id});
      await Student.updateMany({assignedExamId:oldExam._id},{$set:{assignedExamId:null,assignedExamTitle:'',assignedExamDuration:null,assignedExamQuestions:[],examStartedAt:null,examDeadline:null,examSubmittedAt:null,examOrder:[],examQuestionIndex:0},$unset:{examAnswers:1}});
      await Exam.deleteOne({_id:oldExam._id});
    }
    const exam=await Exam.create({title,standard:Number(papers[0].standard),duration,paperCount:papers.length,sourceFile:req.file.originalname,assignedStudents:assigned.map(s=>s._id)});
    const totalMarks=Number(data.totalMarks||50);
    await Test.create({name:title,subject:String(data.subject||'English Grammar'),standard:0,date:new Date(),totalMarks,notes:`Imported online exam · ${duration} minutes`,sourceExamId:exam._id});
    for(const paper of papers){
      const student=assigned.find(s=>s.username===String(paper.studentUsername).trim());
      student.assignedExamId=exam._id;
      student.assignedExamTitle=String(data.title).trim();
      student.assignedExamDuration=duration;
      student.assignedExamQuestions=paper.questions;
      student.examStartedAt=null;
      student.examDeadline=null;
      student.examSubmittedAt=null;
      student.examOrder=[];
      student.examAnswers=new Map();
      student.examQuestionIndex=0;
      await student.save();
    }
    res.redirect('/teacher#tests');
  }catch(e){
    console.error('Exam import:',e.message);
    res.redirect('/teacher?examError='+encodeURIComponent(e.message)+'#tests');
  }
});

app.get('/teacher',teacherAuth,async(req,res)=>{
  const attendanceDateRaw=String(req.query.attendanceDate||'');
  const attendanceDate=/^\d{4}-\d{2}-\d{2}$/.test(attendanceDateRaw)?attendanceDateRaw:new Date().toISOString().slice(0,10);
  const start=new Date(attendanceDate+'T00:00:00');
  const end=new Date(attendanceDate+'T23:59:59.999');
  const [students,fees,leaves,tests,marks,attendance,announcements,classes,homeworks,recordings,exams]=await Promise.all([
    Student.find().sort({standard:1,name:1}).lean(),
    Fee.find({paid:false}).populate('studentId').sort({dueDate:1}).limit(100).lean(),
    LeaveRequest.find({status:'pending'}).populate('studentId').sort({createdAt:-1}).limit(50).lean(),
    Test.find().sort({date:-1}).limit(30).lean(),
    Mark.find().populate('testId studentId').sort({createdAt:-1}).limit(200).lean(),
    Attendance.find({date:{$gte:start,$lte:end}}).populate('studentId').sort({date:1}).lean(),
    Announcement.find().sort({createdAt:-1}).limit(10).lean(),
    ClassSession.find({date:{$gte:new Date()}}).sort({date:1}).limit(20).lean(),
    Homework.find().sort({dueDate:-1}).limit(20).lean(),
    ExamRecording.find({deletedAt:null}).populate('studentId').sort({uploadedAt:-1}).limit(100).lean(),
    Exam.find().sort({createdAt:-1}).limit(20).lean()
  ]);
  // Reconcile imported online exams with the marks/test collection.
  // Older imports may have an Exam document without its linked Test record.
  for (const exam of exams) {
    let linked = tests.find(t => String(t.sourceExamId || '') === String(exam._id));
    if (!linked) {
      const existing = await Test.findOne({ sourceExamId: exam._id }).lean();
      if (existing) {
        linked = existing;
      } else {
        // 10 direct questions (1 mark each) + 10 grammar questions (4 each) = 50 by default.
        const created = await Test.create({
          name: exam.title,
          subject: 'English Grammar',
          standard: 0,
          date: exam.createdAt || new Date(),
          totalMarks: 50,
          notes: `Imported online exam · ${exam.duration} minutes`,
          sourceExamId: exam._id
        });
        linked = created.toObject();
      }
      tests.push(linked);
    }
  }

  res.render('teacher',{students,fees,leaves,tests,marks,attendance,attendanceDate,announcements,classes,homeworks,recordings,exams,examError:req.query.examError||'',teacherName:process.env.TEACHER_NAME||'Kundaram Chandrakala'});
});

app.post('/teacher/attendance/bulk',teacherAuth,async(req,res)=>{
  const raw=String(req.body.date||'');
  const date=/^\d{4}-\d{2}-\d{2}$/.test(raw)?new Date(raw+'T00:00:00'):new Date();
  date.setHours(0,0,0,0);
  const active=await Student.find({status:'active'}).lean();
  const statuses=req.body.status&&typeof req.body.status==='object'?req.body.status:{};
  const note=String(req.body.note||'').slice(0,300);
  for(const student of active){
    const chosen=String(statuses[String(student._id)]||'absent');
    const status=['present','absent','late','leave'].includes(chosen)?chosen:'absent';
    await Attendance.findOneAndUpdate({studentId:student._id,date},{status,note},{upsert:true,new:true,setDefaultsOnInsert:true});
  }
  const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');
  res.redirect('/teacher?attendanceDate='+y+'-'+m+'-'+d+'#attendance');
});
app.post('/teacher/attendance',teacherAuth,async(req,res)=>{
  const date=new Date(req.body.date||Date.now()); date.setHours(0,0,0,0);
  await Attendance.findOneAndUpdate({studentId:req.body.studentId,date},{status:req.body.status,note:req.body.note},{upsert:true});
  res.redirect('/teacher#attendance');
});

app.post('/teacher/leave/:id',teacherAuth,async(req,res)=>{await LeaveRequest.findByIdAndUpdate(req.params.id,{status:req.body.status,teacherNote:req.body.teacherNote});res.redirect('/teacher');});
app.post('/teacher/fee',teacherAuth,async(req,res)=>{await Fee.create({studentId:req.body.studentId,month:req.body.month,amount:Number(req.body.amount),dueDate:new Date(req.body.dueDate),paid:req.body.paid==='true',paidDate:req.body.paid==='true'?new Date():null,method:req.body.method,transactionId:req.body.transactionId});res.redirect('/teacher');});
app.post('/teacher/fee/:id/pay',teacherAuth,async(req,res)=>{await Fee.findByIdAndUpdate(req.params.id,{paid:true,paidDate:new Date(),method:req.body.method||'Cash',transactionId:req.body.transactionId||''});res.redirect('/teacher#fees');});
app.post('/teacher/offline-test/create',teacherAuth,testPaperUpload.single('questionPaper'),async(req,res)=>{try{const name=String(req.body.name||'').trim();const subject=String(req.body.subject||'').trim();const standard=String(req.body.standard||'');const totalMarks=Number(req.body.totalMarks);const dateRaw=String(req.body.date||'');if(!name||!['all','9','10'].includes(standard)||!Number.isFinite(totalMarks)||totalMarks<=0||!dateRaw)return res.redirect('/teacher#tests');const doc={name,subject,standard:standard==='all'?0:Number(standard),date:new Date(dateRaw+'T00:00:00'),totalMarks,type:'offline',notes:String(req.body.notes||'').slice(0,500),sourceExamId:null};if(req.file)doc.questionPaper={fileName:req.file.originalname,filePath:req.file.path,mimeType:req.file.mimetype,size:req.file.size};await Test.create(doc);res.redirect('/teacher#tests');}catch(e){console.error(e);res.redirect('/teacher#tests');}});
app.get('/teacher/test/:id/paper',teacherAuth,async(req,res)=>{const test=await Test.findById(req.params.id).lean();if(!test||test.type!=='offline'||!test.questionPaper?.filePath||!fs.existsSync(test.questionPaper.filePath))return res.sendStatus(404);res.set('Content-Disposition','inline');res.type(test.questionPaper.mimeType||'application/pdf');res.sendFile(path.resolve(test.questionPaper.filePath));});
app.post('/teacher/mark',teacherAuth,async(req,res)=>{const marks=Number(req.body.marks);const test=await Test.findById(req.body.testId).lean();if(!test||!Number.isFinite(marks)||marks<0||marks>Number(test.totalMarks))return res.redirect('/teacher#marks');const student=await Student.findById(req.body.studentId).select('_id standard assignedExamId').lean();if(!student)return res.redirect('/teacher#marks');if(test.sourceExamId){if(String(student.assignedExamId)!==String(test.sourceExamId))return res.redirect('/teacher#marks');}else if(test.standard!==0&&test.standard!==Number(student.standard))return res.redirect('/teacher#marks');await Mark.findOneAndUpdate({testId:req.body.testId,studentId:req.body.studentId},{marks,remark:String(req.body.remark||'').slice(0,300),published:req.body.published==='true'},{upsert:true,setDefaultsOnInsert:true});res.redirect('/teacher#marks');});
app.post('/teacher/test/:id/delete',teacherAuth,async(req,res)=>{const test=await Test.findById(req.params.id).lean();if(!test)return res.redirect('/teacher#tests');await Mark.deleteMany({testId:test._id});if(test.sourceExamId){await Student.updateMany({assignedExamId:test.sourceExamId},{$set:{assignedExamId:null,assignedExamTitle:'',assignedExamDuration:null,assignedExamQuestions:[],examStartedAt:null,examDeadline:null,examSubmittedAt:null,examOrder:[],examQuestionIndex:0},$unset:{examAnswers:1}});await Test.deleteMany({sourceExamId:test.sourceExamId});await Exam.deleteOne({_id:test.sourceExamId});}else{if(test.questionPaper?.filePath){try{await fsp.unlink(test.questionPaper.filePath);}catch{}}await Test.deleteOne({_id:test._id});}res.redirect('/teacher#tests');});
app.post('/teacher/announcement',teacherAuth,async(req,res)=>{await Announcement.create({title:req.body.title,body:req.body.body,audience:req.body.audience||'all'});res.redirect('/teacher');});
app.post('/teacher/class',teacherAuth,async(req,res)=>{await ClassSession.create({title:req.body.title,standard:Number(req.body.standard),subject:req.body.subject,date:new Date(req.body.date),startTime:req.body.startTime,endTime:req.body.endTime,room:req.body.room,notes:req.body.notes});res.redirect('/teacher');});
app.post('/teacher/homework',teacherAuth,homeworkUpload.single('attachment'),async(req,res)=>{const h={title:req.body.title,description:req.body.description,standard:Number(req.body.standard),subject:req.body.subject,dueDate:new Date(req.body.dueDate)};if(req.file)h.attachment={originalName:req.file.originalname,fileName:req.file.filename,filePath:req.file.path,mimeType:req.file.mimetype,size:req.file.size};await Homework.create(h);res.redirect('/teacher#homework');});
app.post('/teacher/student',teacherAuth,async(req,res)=>{const name=String(req.body.name||'').trim(),standard=Number(req.body.standard),studentId=String(req.body.studentId||'').trim().toUpperCase(),username=String(req.body.username||'').trim();if(!name||![9,10].includes(standard)||!studentId||!username||!req.body.password)return res.redirect('/teacher#students');const exists=await Student.findOne({$or:[{studentId},{username}]});if(exists)return res.redirect('/teacher#students');const paperCode=studentId;const passwordHash=await bcrypt.hash(req.body.password,12);await Student.create({studentId,name,standard,username,passwordHash,paperCode,parentName:req.body.parentName,parentPhone:req.body.parentPhone,studentPhone:req.body.studentPhone,school:req.body.school,joiningDate:req.body.joiningDate?new Date(req.body.joiningDate):new Date(),subjects:String(req.body.subjects||'').split(',').map(x=>x.trim()).filter(Boolean),status:'active'});res.redirect('/teacher#students');});
app.post('/teacher/student/:id/update',teacherAuth,async(req,res)=>{const s=await Student.findById(req.params.id);if(!s)return res.redirect('/teacher#students');Object.assign(s,{name:req.body.name,standard:Number(req.body.standard),parentName:req.body.parentName,parentPhone:req.body.parentPhone,studentPhone:req.body.studentPhone,school:req.body.school,subjects:String(req.body.subjects||'').split(',').map(x=>x.trim()).filter(Boolean)});if(req.body.password)s.passwordHash=await bcrypt.hash(req.body.password,12);await s.save();res.redirect('/teacher#students');});
app.post('/teacher/student/:id/status',teacherAuth,async(req,res)=>{const s=await Student.findById(req.params.id);if(s){s.status=s.status==='active'?'inactive':'active';if(s.status==='inactive')s.activeSessionId=null;await s.save();}res.redirect('/teacher#students');});
app.get('/homework/:id/view',studentAuth,async(req,res)=>{const h=await Homework.findOne({_id:req.params.id,standard:req.student.standard}).lean();if(!h||!h.attachment)return res.sendStatus(404);res.render('homework-viewer',{homework:h,student:req.student});});
app.get('/homework/:id/file',studentAuth,async(req,res)=>{const h=await Homework.findOne({_id:req.params.id,standard:req.student.standard}).lean();if(!h||!h.attachment||!fs.existsSync(h.attachment.filePath))return res.sendStatus(404);res.set('Content-Disposition','inline');res.type(h.attachment.mimeType);res.sendFile(path.resolve(h.attachment.filePath));});
app.get('/teacher/homework/:id/file',teacherAuth,async(req,res)=>{const h=await Homework.findById(req.params.id).lean();if(!h||!h.attachment||!fs.existsSync(h.attachment.filePath))return res.sendStatus(404);res.set('Content-Disposition','inline');res.type(h.attachment.mimeType);res.sendFile(path.resolve(h.attachment.filePath));});
app.get('/teacher/recording/:id',teacherAuth,async(req,res)=>{const rec=await ExamRecording.findById(req.params.id).lean();if(!rec||rec.deletedAt)return res.sendStatus(404);res.type('webm');res.sendFile(path.resolve(rec.filePath),{acceptRanges:true},err=>{if(err&&!res.headersSent)res.sendStatus(404);});});
app.post('/teacher/recording/:id/flag',teacherAuth,async(req,res)=>{await ExamRecording.findByIdAndUpdate(req.params.id,{flagged:req.body.flagged==='true'});res.redirect('/teacher');});
app.post('/teacher/recording/:id/delete',teacherAuth,async(req,res)=>{const rec=await ExamRecording.findById(req.params.id);if(rec){try{await fsp.unlink(rec.filePath);}catch{}rec.deletedAt=new Date();await rec.save();}res.redirect('/teacher');});
app.get('/teacher/activity',teacherAuth,async(req,res)=>{const students=await Student.find().sort({standard:1,name:1}).lean();res.render('activity',{students,student:null,activities:[]});});
app.get('/teacher/activity/:id',teacherAuth,async(req,res)=>{const students=await Student.find().sort({standard:1,name:1}).lean();const student=await Student.findById(req.params.id).lean();const activities=student?await Activity.find({studentId:req.params.id}).sort({createdAt:-1}).limit(500).lean():[];res.render('activity',{students,student,activities});});
async function cleanupOldRecordings(){const cutoff=new Date(Date.now()-7*24*60*60*1000);const old=await ExamRecording.find({flagged:false,uploadedAt:{$lt:cutoff},deletedAt:null});for(const rec of old){try{await fsp.unlink(rec.filePath);}catch{}rec.deletedAt=new Date();await rec.save();}}
cleanupOldRecordings().catch(console.error); setInterval(()=>cleanupOldRecordings().catch(console.error),60*60*1000);
mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/kundaram_tuition').then(async()=>{await ensureDefaultStudents();app.listen(PORT,'0.0.0.0',()=>console.log(`Kundaram Chandrakala Tuition Manager running on port ${PORT}`));}).catch(e=>{console.error(e);process.exit(1)});
