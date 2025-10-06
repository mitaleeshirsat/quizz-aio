import { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function UserLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error. Make sure the server is running.');
    }
  };

  return (
    <div className="container">
      <button onClick={onBack} className="back-btn">← Back</button>
      <h2>Enter Your Name</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary">
          Continue
        </button>
      </form>
    </div>
  );
}

export default UserLogin;