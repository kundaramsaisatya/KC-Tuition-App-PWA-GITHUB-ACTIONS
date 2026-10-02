require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

const rows = [
  ['S01', 'Shravya', 9, 'shravya01', 'Shravya@123'],
  ['N02', 'Nihansa', 9, 'nihansa01', 'Nihansa@123'],
  ['V03', 'Varshita', 9, 'varshita01', 'Varshita@123'],
  ['D04', 'Dhristi', 9, 'dhristi01', 'Dhristi@123'],
  ['A05', 'Anandi', 10, 'anandi01', 'Anandi@123'],
  ['A06', 'Akshara', 10, 'akshara01', 'Akshara@123'],
  ['R07', 'Rishabh', 10, 'rishabh01', 'Rishabh@123'],
  ['R08', 'Riya', 10, 'riya01', 'Riya@123']
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');

  await mongoose.connect(uri);
  let created = 0;
  let existing = 0;

  for (const [id, name, standard, username, password] of rows) {
    const found = await Student.findOne({ studentId: id });
    if (found) {
      existing++;
      continue;
    }

    await Student.create({
      studentId: id,
      name,
      standard,
      username,
      passwordHash: await bcrypt.hash(password, 12),
      paperCode: id
    });
    created++;
  }

  console.log(`Seed complete: ${created} students created, ${existing} already existed.`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err.message);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
