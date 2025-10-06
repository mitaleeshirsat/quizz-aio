import { useState, useEffect } from 'react';
import CreateQuiz from './CreateQuiz';

const API_URL = 'http://localhost:3000/api';

function HostDashboard({ host, onLogout }) {
  const [showCreate, setShowCreate] = useState(false);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_URL}/host/${host.id}/quizzes`);
      const data = await response.json();
      if (data.success) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  const handleQuizCreated = () => {
    setShowCreate(false);
    fetchQuizzes();
  };

  if (showCreate) {
    return (
      <CreateQuiz
        host={host}
        onBack={() => setShowCreate(false)}
        onQuizCreated={handleQuizCreated}
      />
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h2>Welcome, {host.username}!</h2>
        <button onClick={onLogout} className="btn-danger">Logout</button>
      </div>

      <button onClick={() => setShowCreate(true)} className="btn-primary">
        + Create New Quiz
      </button>

      <div className="quiz-list">
        <h3>Your Quizzes</h3>
        {quizzes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No quizzes yet. Create your first quiz!
          </p>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-item">
              <div>
                <h4>{quiz.title}</h4>
                <p className="code">Code: {quiz.code}</p>
                <p style={{ color: '#999', fontSize: '0.9em' }}>
                  Created: {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HostDashboard;