import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail } from 'react-icons/fi';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email) {
      alert('Please enter name and email');
      return;
    }
    const user = { name, email };
    localStorage.setItem('vibe_user', JSON.stringify(user));
    navigate('/');
  }

  return (
    <div className="login-page">
      {/* Decorative blobs for background */}
      <div className="login-decor blob-top" />
      <div className="login-decor blob-bottom" />

      {/* Main login form card */}
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Login / Sign Up</h2>

        <div className="form-row">
          <div className="icon-box"><FiUser size={18} /></div>
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="icon-box"><FiMail size={18} /></div>
          <input
            className="input"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button className="btn-primary" type="submit">Continue</button>
        </div>

        <div className="center" style={{ marginTop: 12 }}>
          <p className="text-muted">By continuing you accept our Terms & Privacy</p>
        </div>
      </form>
    </div>
  );
}
