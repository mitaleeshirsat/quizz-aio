import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'quizzes.db'));

// Initialize database tables
export function initDatabase() {
  db.serialize(() => {
    // Hosts table
    db.run(`CREATE TABLE IF NOT EXISTS hosts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      total_points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Quizzes table
    db.run(`CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      host_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      questions TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (host_id) REFERENCES hosts(id)
    )`);

    // Quiz attempts table
    db.run(`CREATE TABLE IF NOT EXISTS quiz_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )`);

    console.log('Database initialized successfully');
  });
}

// Host functions
export function createHost(username, password) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO hosts (username, password) VALUES (?, ?)',
      [username, password],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username });
      }
    );
  });
}

export function getHost(username, password) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM hosts WHERE username = ? AND password = ?',
      [username, password],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

// User functions
export function createUser(username) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username) VALUES (?)',
      [username],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, username, total_points: 0 });
      }
    );
  });
}

export function getUser(username) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

export function updateUserPoints(userId, points) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET total_points = total_points + ? WHERE id = ?',
      [points, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

// Quiz functions
export function createQuiz(hostId, title, code, questions) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO quizzes (host_id, title, code, questions) VALUES (?, ?, ?, ?)',
      [hostId, title, code, JSON.stringify(questions)],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, code });
      }
    );
  });
}

export function getQuizByCode(code) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM quizzes WHERE code = ?',
      [code],
      (err, row) => {
        if (err) reject(err);
        else if (row) {
          row.questions = JSON.parse(row.questions);
          resolve(row);
        } else {
          resolve(null);
        }
      }
    );
  });
}

export function getQuizzesByHost(hostId) {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT id, title, code, created_at FROM quizzes WHERE host_id = ? ORDER BY created_at DESC',
      [hostId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// Quiz attempt functions
export function saveQuizAttempt(userId, quizId, score, totalQuestions) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions) VALUES (?, ?, ?, ?)',
      [userId, quizId, score, totalQuestions],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

export function getUserQuizHistory(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT qa.*, q.title as quiz_title, q.code as quiz_code 
       FROM quiz_attempts qa 
       JOIN quizzes q ON qa.quiz_id = q.id 
       WHERE qa.user_id = ? 
       ORDER BY qa.attempted_at DESC`,
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

export default db;