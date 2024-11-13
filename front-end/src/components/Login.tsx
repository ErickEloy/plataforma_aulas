import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api-token-auth/', {
        username,
        password,
      });

      console.log('Resposta do servidor:', response); // Verifique a resposta completa do servidor



      if (response.data.token) {
        // Verifique se o token está presente
        onLogin(response.data.token); // Passa o token para o App.tsx
      } else {
        setError('Token não encontrado na resposta');
      }
    } catch (error: any) {
      console.error('Erro de login:', error.response ? error.response.data : error.message);
      setError('Erro ao fazer login');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
