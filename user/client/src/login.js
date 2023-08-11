import React, { useState } from 'react';
import './styles/login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const url = 'http://localhost:4000/login';

  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(url, {
        username: username,
        password: password,
      });

      onLogin();

      console.clear();
      console.log(response.data);

      // Pasar los valores de usuario a la página de inicio
      navigate('/home', { state: { userUsername: username, userPassword: password } });
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.log(error.response.data);
        setError('Error al iniciar sesión. Verifica tus credenciales.');
      } else {
        setError('Error de conexión. Inténtalo nuevamente más tarde.');
      }
    }

    setPassword('');
    setUsername('');
  };

  return (
    <>
      <div id="main">
        <img id="logo" src="/biconlogo.png" alt="bicon" />

        <div id="login-container">
          <h2 id="subtitle">Iniciar sesión</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div id="username-container">
              <input
                type="text"
                id="username"
                value={username}
                placeholder="usuario"
                onChange={handleUsernameChange}
              />
            </div>

            <div id="password-container">
              <input
                type="password"
                id="password"
                value={password}
                placeholder="contraseña"
                onChange={handlePasswordChange}
              />
            </div>

            <div id="submit">
              <button id="submit-button" type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;