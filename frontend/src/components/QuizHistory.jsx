import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

function QuizHistory({ user, onStartQuiz, onLogout }) {
  const [quizCode, setQuizCode] = useState('');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${user.id}/history`);
      const data = await response.json();
      if (data.success) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleJoinQuiz = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/quiz/${quizCode.toUpperCase()}`);
      const data = await response.json();

      if (data.success) {
        onStartQuiz(data.quiz);
      } else {
        setError('Quiz not found. Please check the code.');
      }
    } catch (err) {
      setError('Error loading quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2>Welcome, {user.username}!</h2>
        </div>
        <div className="user-info">
          <h3>Total Points</h3>
          <div className="points">{user.total_points} 🏆</div>
          <button onClick={onLogout} className="btn-danger" style={{ marginTop: '10px' }}>
            Logout
          </button>
        </div>
      </div>

      <form onSubmit={handleJoinQuiz}>
        <div className="form-group">
          <label>Enter Quiz Code</label>
          <input
            type="text"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            placeholder="e.g., ABC123"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-success" disabled={loading}>
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>
      </form>

      <div className="history-list">
        <h3>Quiz History</h3>
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No quiz attempts yet. Enter a quiz code to get started!
          </p>
        ) : (
          history.map((item) => (
            <div key={item.id} className="history-item">
              <h4>{item.quiz_title}</h4>
              <p>Code: {item.quiz_code}</p>
              <p className="score">
                Score: {item.score} / {item.total_questions}
              </p>
              <p style={{ color: '#999', fontSize: '0.9em' }}>
                {new Date(item.attempted_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default QuizHistory;