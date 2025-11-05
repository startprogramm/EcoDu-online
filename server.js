require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Lesson = require('./models/Lesson'); // existing lessons model
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ecodu';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth routes
app.use('/api/auth', authRoutes);

// Lesson routes (kept from your previous server.js)
app.get('/', (req, res) => res.send('EcoDu backend running!'));

app.get('/api/lessons', async (req, res) => {
  const lessons = await Lesson.find();
  res.json(lessons);
});

app.post('/api/lessons', async (req, res) => {
  const lesson = new Lesson(req.body);
  await lesson.save();
  res.status(201).json(lesson);
});

app.get('/api/lessons/:id', async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) return res.status(404).send('Lesson not found');
  res.json(lesson);
});

app.put('/api/lessons/:id', async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lesson) return res.status(404).send('Lesson not found');
  res.json(lesson);
});

app.delete('/api/lessons/:id', async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) return res.status(404).send('Lesson not found');
  res.json({ message: 'Lesson deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));