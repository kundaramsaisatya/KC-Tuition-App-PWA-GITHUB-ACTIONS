# KC Tuition Manager v6 upgrade

Implemented in this build:

- Homework files now use MongoDB GridFS, matching exam-recording persistence.
- Teacher homework create, edit, replace attachment, preview and delete.
- Per-student homework completion records with done/pending status and completion time.
- Teacher homework dashboard showing completion counts and every student's status.
- Student homework status per assignment instead of one global status.
- Student test/result view remains available and teacher marks now trigger notifications.
- Student activity logging for login, route/page views, tab/hash changes, heartbeat, visibility changes and exit detection.
- Activity timestamps use the app's India Standard Time formatter instead of browser local time.
- Student-teacher chat with text and file attachments.
- In-app notification center.
- Optional email notifications using Resend API.
- Optional SMS notifications using Twilio API.
- Notifications for attendance, homework, test results, leave decisions, fee payments and announcements.
- Student and parent email fields added to student management.
- Dashboard interaction effects, animated accents, improved cards, chat bubbles and notification UI.
- New .env.example with notification provider configuration.

Important:

- SMS/email delivery only activates when the corresponding provider credentials are configured.
- Browser/PWA exit detection is best-effort because mobile operating systems can terminate a browser without firing a final event. Heartbeats and last-seen timestamps are used alongside exit events for reliable activity monitoring.
