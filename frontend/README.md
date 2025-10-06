#  AI-Powered Quiz Platform

An intelligent quiz creation and assessment platform that leverages Google Gemini AI to automatically generate quiz questions from any content. Perfect for educators, trainers, and students!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### For Hosts (Teachers/Content Creators)
- 🤖 **AI-Powered Quiz Generation**: Upload any content and let Gemini AI create 5 multiple-choice questions automatically
- 📊 **Dashboard Management**: View all created quizzes with unique access codes
- 🔐 **Secure Authentication**: Login system for hosts to manage their quizzes
- 📤 **Easy Sharing**: Generate unique quiz codes to share with students

### For Students
- 🎓 **Code-Based Access**: Enter quiz codes to access specific quizzes
- ⚡ **Interactive Quiz Taking**: Clean, intuitive interface for answering questions
- 📈 **Score Tracking**: Real-time scoring with points accumulation
- 📜 **Quiz History**: View all past quiz attempts with scores and dates
- 🏆 **Leaderboard Points**: Cumulative points system across all quizzes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **Google Gemini API** - AI-powered question generation

### Additional Technologies
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get one here](https://aistudio.google.com/app/apikey)

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/mitaleeshirsat/quizz-aio.git
cd quizz-aio
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the **root directory**:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** Never commit your `.env` file to version control!

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

### Step 5: Start the Backend Server

In the backend terminal:

```bash
cd backend
npm start
```

You should see:
```
Database initialized successfully
Server running on http://localhost:3000
Using Gemini AI for quiz generation
```

### Step 6: Start the Frontend Development Server

In the frontend terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Step 7: Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 📖 Usage Guide

### For Hosts (Creating Quizzes)

1. **Sign Up/Login**
   - Click "Host Login" on the home page
   - Create a new account or login with existing credentials

2. **Create a Quiz**
   - Click "Create New Quiz" button
   - Enter a quiz title (e.g., "World War 2 History")
   - Paste your study content/material
   - Click "Generate Quiz with AI"
   - Wait for AI to generate 5 questions (takes 5-10 seconds)

3. **Share the Quiz**
   - Copy the unique quiz code (e.g., "ABC123")
   - Share this code with your students via email, WhatsApp, etc.

4. **View Your Quizzes**
   - All created quizzes appear on your dashboard
   - See quiz titles, codes, and creation dates

### For Students (Taking Quizzes)

1. **Enter the Platform**
   - Click "Take a Quiz" on the home page
   - Enter your username (no password needed)

2. **Access a Quiz**
   - Enter the quiz code provided by your teacher
   - Click "Start Quiz"

3. **Answer Questions**
   - Read each question carefully
   - Select one answer from four options (A, B, C, D)
   - Click "Next Question" to proceed
   - Click "Submit Quiz" on the last question

4. **View Results**
   - See your score immediately after submission
   - Points are added to your total score

5. **Check History**
   - View all past quiz attempts
   - See scores, dates, and quiz names
   - Track your total points

## 📁 Project Structure

```
quiz-platform/
├── backend/
│   ├── database.js          # Database queries and operations
│   ├── server.js            # Express server and API routes
│   ├── package.json         # Backend dependencies
│   └── quizzes.db          # SQLite database (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HostLogin.jsx       # Host authentication
│   │   │   ├── HostDashboard.jsx   # Host quiz management
│   │   │   ├── CreateQuiz.jsx      # Quiz creation with AI
│   │   │   ├── UserLogin.jsx       # Student login
│   │   │   ├── TakeQuiz.jsx        # Quiz taking interface
│   │   │   └── QuizHistory.jsx     # Student history & stats
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Global styles
│   │   └── main.jsx         # React entry point
│   ├── index.html           # HTML template
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
│
├── .env                     # Environment variables (DO NOT COMMIT!)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🗄️ Database Schema

The SQLite database contains four tables:

### hosts
- `id` - Primary key
- `username` - Unique host username
- `password` - Host password (plain text - consider hashing for production)
- `created_at` - Account creation timestamp

### users
- `id` - Primary key
- `username` - Unique student username
- `total_points` - Cumulative points across all quizzes
- `created_at` - Account creation timestamp

### quizzes
- `id` - Primary key
- `host_id` - Foreign key to hosts table
- `title` - Quiz title
- `code` - Unique 6-character quiz code
- `questions` - JSON array of question objects
- `created_at` - Quiz creation timestamp

### quiz_attempts
- `id` - Primary key
- `user_id` - Foreign key to users table
- `quiz_id` - Foreign key to quizzes table
- `score` - Number of correct answers
- `total_questions` - Total questions in quiz
- `attempted_at` - Attempt timestamp

## 🔌 API Endpoints

### Host Endpoints

```
POST /api/host/signup
POST /api/host/login
POST /api/quiz/create
GET  /api/host/:hostId/quizzes
```

### User Endpoints

```
POST /api/user/login
GET  /api/quiz/:code
POST /api/quiz/submit
GET  /api/user/:userId/history
```

## 🎨 Customization

### Change Color Scheme

Edit `frontend/src/App.css`:

```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change these hex values to your preferred colors */
}
```

### Modify Number of Questions

Edit `backend/server.js`, find the quiz creation prompt:

```javascript
const prompt = `Generate exactly 5 multiple choice questions...`;
// Change 5 to your desired number
```

### Change AI Model

Edit `backend/server.js`:

```javascript
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// Options: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash
```

## 🐛 Troubleshooting

### Backend Issues

**Problem:** "Cannot find module" errors
```bash
cd backend
rm -rf node_modules
npm install
```

**Problem:** "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [process_id] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Problem:** "Failed to generate quiz"
- Check if your Gemini API key is correct in `.env`
- Verify you have quota remaining at https://aistudio.google.com/app/apikey
- Try using a different model: `gemini-2.0-flash` or `gemini-2.5-pro`

### Frontend Issues

**Problem:** Blank screen
- Check browser console (F12) for errors
- Verify backend is running on port 3000
- Clear browser cache (Ctrl + Shift + R)

**Problem:** "Connection error"
```bash
# Make sure backend is running
cd backend
npm start
```

### Database Issues

**Problem:** Database locked or corrupted
```bash
cd backend
rm quizzes.db
# Restart backend server - new database will be created
npm start
```

## 🔒 Security Considerations

**For Production Deployment:**

1. **Hash Passwords**: Implement bcrypt for password hashing
2. **JWT Authentication**: Use JSON Web Tokens instead of session storage
3. **Input Validation**: Add validation middleware (express-validator)
4. **Rate Limiting**: Implement API rate limiting (express-rate-limit)
5. **HTTPS**: Use SSL certificates
6. **Environment Variables**: Use secure secret management
7. **SQL Injection**: Use parameterized queries (already implemented)
8. **CORS**: Restrict CORS to specific domains

## 🚀 Deployment

### Deploy Backend (Heroku Example)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create quiz-platform-backend

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key_here

# Deploy
git push heroku main
```

### Deploy Frontend (Vercel Example)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts
```

Don't forget to update the API URL in frontend code to your deployed backend URL!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Google Gemini AI for powerful question generation
- React team for the amazing frontend library
- Express.js for the robust backend framework
- SQLite for the lightweight database solution

## 📧 Contact

 [@mitaleeshirsat](https://x.com/mitaleeshirsat)

Project Link: [https://github.com/mitaleeshirsat/quizz-aio](https://github.com/mitaleeshirsat/quizz-aio)

## 🎯 Future Enhancements

- [ ] Add timer for quizzes
- [ ] Support for true/false and fill-in-the-blank questions
- [ ] Export quiz results to CSV/PDF
- [ ] Dark mode toggle
- [ ] Mobile app version
- [ ] Real-time multiplayer quizzes
- [ ] Question difficulty levels
- [ ] Image support in questions
- [ ] Quiz analytics dashboard
- [ ] Email notifications

---

**Made with ❤️ and ☕ by [Your Name]**

*If you found this project helpful, please give it a ⭐ on GitHub!*