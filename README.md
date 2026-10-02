# Kundaram Chandrakala Tuition Manager v5

A Node.js + Express + MongoDB + EJS tuition management app.

## Setup

1. Install Node.js and MongoDB.
2. Copy `.env.example` to `.env`.
3. Set your teacher username/password and MongoDB URI.
4. Run:

```bash
npm install
npm run seed
npm start
```

Open `http://localhost:3000`.

## Teacher dashboard

Separate tabs are provided for:

- Overview
- Students
- Attendance
- Tests
- Marks
- Homework
- Fees
- Classes
- Announcements
- Exam Recordings
- Student Activity

### Attendance

Choose the date once, tick Present for students, use Mark all present when appropriate, and save the whole class at once. Unticked students become Absent unless Late or Leave is selected.

### Tests

Use the JSON importer for student-specific online papers. The importer validates 20 questions per paper, including 10 direct-to-indirect and 10 grammar questions with 4 subquestions each.

Imported online tests automatically create result records for the appropriate standards, so there is no separate Create Test form.

### Marks

Select a test, select one student, enter marks and an optional remark, then publish the result. Published marks appear on that student's dashboard.

## Student activity

Teacher Dashboard → Student Activity shows all students. Select any student to view their activity log.

## Student privacy

Camera recording and activity logging should be used with appropriate notice and consent. Browser-side controls cannot prevent screenshots or recording by another device.


## Test and Marks behavior
- There is no manual Create Test screen.
- Importing an online JSON paper set creates one test record for that online exam.
- The imported online exam appears in Teacher → Marks.
- Selecting an online exam automatically shows only students assigned that exam.
- Marks can be saved and published for an individual student.
- Deleting an online test removes its exam assignment and associated marks.
- Legacy manually-created Test records without `sourceExamId` are cleaned on server startup because the app now uses imported online exams as the test source.
