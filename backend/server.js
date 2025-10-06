import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  initDatabase,
  createHost,
  getHost,
  createUser,
  getUser,
  updateUserPoints,
  createQuiz,
  getQuizByCode,
  getQuizzesByHost,
  saveQuizAttempt,
  getUserQuizHistory
} from './database.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('Environment check:');
console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('API Key starts with AIza:', process.env.GEMINI_API_KEY?.startsWith('AIza'));
console.log('API Key length:', process.env.GEMINI_API_KEY?.length);

const app = express();
const PORT = 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
initDatabase();

// Generate random quiz code
function generateQuizCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ===== HOST ROUTES =====

// Host signup
app.post('/api/host/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const host = await createHost(username, password);
    res.json({ success: true, host });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Username already exists' });
  }
});

// Host login
app.post('/api/host/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const host = await getHost(username, password);
    if (host) {
      res.json({ success: true, host });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create quiz with AI-generated questions using Gemini
app.post('/api/quiz/create', async (req, res) => {
  try {
    const { hostId, title, content } = req.body;
    
    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Create prompt for Gemini
    const prompt = `Generate exactly 5 multiple choice questions based on the following content. 
    
Content: ${content}

Return ONLY a valid JSON array with no additional text, markdown formatting, or code blocks. The response must start with [ and end with ].

Use this exact format:
[
  {
    "question": "What is...",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "correctAnswer": 0
  }
]

Where correctAnswer is the index (0-3) of the correct option. Generate 5 questions now:`;

    // Generate content using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();
    
    // Parse the JSON
    const questions = JSON.parse(cleanedText);
    
    // Validate the questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid questions format');
    }

    const code = generateQuizCode();
    const quiz = await createQuiz(hostId, title, code, questions);

    res.json({ success: true, quiz: { ...quiz, questions } });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate quiz. Please check your API key and try again.' 
    });
  }
});

// Get host's quizzes
app.get('/api/host/:hostId/quizzes', async (req, res) => {
  try {
    const quizzes = await getQuizzesByHost(req.params.hostId);
    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ===== USER ROUTES =====

// User login/signup
app.post('/api/user/login', async (req, res) => {
  try {
    const { username } = req.body;
    let user = await getUser(username);
    
    if (!user) {
      user = await createUser(username);
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get quiz by code
app.get('/api/quiz/:code', async (req, res) => {
  try {
    const quiz = await getQuizByCode(req.params.code);
    if (quiz) {
      res.json({ success: true, quiz });
    } else {
      res.status(404).json({ success: false, message: 'Quiz not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Submit quiz attempt
app.post('/api/quiz/submit', async (req, res) => {
  try {
    const { userId, quizId, score, totalQuestions } = req.body;
    
    await saveQuizAttempt(userId, quizId, score, totalQuestions);
    await updateUserPoints(userId, score);
    
    const user = await getUser(userId);
    
    res.json({ success: true, totalPoints: user.total_points });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user quiz history
app.get('/api/user/:userId/history', async (req, res) => {
  try {
    const history = await getUserQuizHistory(req.params.userId);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Gemini AI for quiz generation`);
});