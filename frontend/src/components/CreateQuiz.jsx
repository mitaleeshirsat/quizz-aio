import { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function CreateQuiz({ host, onBack, onQuizCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quizCode, setQuizCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/quiz/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostId: host.id,
          title,
          content
        })
      });

      const data = await response.json();

      if (data.success) {
        setQuizCode(data.quiz.code);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to create quiz. Make sure your OpenAI API key is set.');
    } finally {
      setLoading(false);
    }
  };

  if (quizCode) {
    return (
      <div className="container">
        <h2>Quiz Created Successfully! 🎉</h2>
        <div className="quiz-code">
          <h3>Share this code with your students:</h3>
          <div className="code">{quizCode}</div>
        </div>
        <button onClick={onQuizCreated} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h2>Create New Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., World War 2 Quiz"
            required
          />
        </div>
        <div className="form-group">
          <label>Content (paste your study material)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the content you want to generate quiz questions from..."
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-success" disabled={loading}>
          {loading ? 'Generating Quiz...' : 'Generate Quiz with AI'}
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;