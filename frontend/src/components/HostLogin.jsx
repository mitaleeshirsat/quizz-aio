import { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function HostLogin({ onLogin, onBack }) {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignup ? '/host/signup' : '/host/login';

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.host);
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
      <h2>{isSignup ? 'Host Signup' : 'Host Login'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary">
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ color: '#667eea', cursor: 'pointer', fontWeight: 'bold' }}
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Login' : 'Sign Up'}
        </span>
      </p>
    </div>
  );
}

export default HostLogin;