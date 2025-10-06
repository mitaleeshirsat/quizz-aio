import { useState } from 'react';
import './App.css';
import HostLogin from './components/HostLogin';
import HostDashboard from './components/HostDashboard';
import UserLogin from './components/UserLogin';
import TakeQuiz from './components/TakeQuiz';
import QuizHistory from './components/QuizHistory';

function App() {
  const [view, setView] = useState('home');
  const [host, setHost] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleHostLogin = (hostData) => {
    setHost(hostData);
    setView('host-dashboard');
  };

  const handleUserLogin = (userData) => {
    setUser(userData);
    setView('user-dashboard');
  };

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setView('take-quiz');
  };

  const handleQuizComplete = () => {
    setView('user-dashboard');
  };

  const handleLogout = () => {
    setHost(null);
    setUser(null);
    setView('home');
  };

  return (
    <div className="app">
      {view === 'home' && (
        <div className="home-screen">
          <h1>🎯 Quiz Platform</h1>
          <p>AI-Powered Quiz Creation & Learning</p>
          <div className="button-group">
            <button onClick={() => setView('host-login')} className="btn-primary">
              Host Login
            </button>
            <button onClick={() => setView('user-login')} className="btn-secondary">
              Take a Quiz
            </button>
          </div>
        </div>
      )}

      {view === 'host-login' && (
        <HostLogin onLogin={handleHostLogin} onBack={() => setView('home')} />
      )}

      {view === 'host-dashboard' && (
        <HostDashboard host={host} onLogout={handleLogout} />
      )}

      {view === 'user-login' && (
        <UserLogin onLogin={handleUserLogin} onBack={() => setView('home')} />
      )}

      {view === 'user-dashboard' && (
        <QuizHistory 
          user={user} 
          onStartQuiz={handleStartQuiz} 
          onLogout={handleLogout} 
        />
      )}

      {view === 'take-quiz' && (
        <TakeQuiz 
          quiz={selectedQuiz} 
          user={user} 
          onComplete={handleQuizComplete} 
        />
      )}
    </div>
  );
}

export default App;