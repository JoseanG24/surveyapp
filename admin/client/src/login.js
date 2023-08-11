import React, { useState } from "react";
import styles from "./styles/login.module.css";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const url = "http://localhost:5000/login";

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

      localStorage.setItem("accessToken", response.data.token);

      onLogin();

      console.clear();
      console.log(response.data);

    } catch (error) {
      console.log(error);

      if (error.response) {
        console.log(error.response.data);
        setError("Error al iniciar sesión. Verifica tus credenciales.");
      } else {
        setError("Error de conexión. Inténtalo nuevamente más tarde.");
      }
    }

    setPassword("");
    setUsername("");
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.descriptionContainer}>
          <img className={styles.logo} src="/biconlogo - copia.png" alt="bicon" />
          <h2 className={styles.subtitle}>¡Bienvenido!</h2>
          <p className={`${styles.descriptionText} ${styles.paragraph}`}>
            <b>BiCon Survey</b> es una solución que permite a los colaboradores
            identificar las actividades que se realizan y asignarles un peso que
            refleje la intensidad con la que ejecutan. La información recabada
            será de utilidad para el Modelo de Costeo Basado en Actividades.
          </p>
        </div>

        <div className={styles.login}>
          <h2 className={styles.loginH2}>Iniciar sesión</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div>
              <label className={styles.loginLabel} htmlFor="username">
                Usuario:
              </label>  
              <input
                className={styles.loginInput}
                value={username}
                onChange={handleUsernameChange}
              />
            </div>

            <div>
              <label className={styles.loginLabel} htmlFor="password">
                Contraseña:
              </label>
              <input
                type="password"
                className={styles.loginInput}
                value={password}
                onChange={handlePasswordChange}
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;