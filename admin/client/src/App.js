import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./styles/header.css";
import Login from "./login.js";
import Cecos from "./components/cecos.js";
import ResourceGroups from "./components/puestos.js";
import Activities from "./components/actividades.js";
import Encuestas from "./components/encuestas.js";
import Users from "./components/usuarios";  
import TotalReports from "./components/totales";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    return storedIsLoggedIn === "true";
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  useEffect(() => {
    // Verificar el estado de inicio de sesión al cargar la página
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getAccessToken = () => {
    return localStorage.getItem("accessToken");
  }

  axios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    
    (error) => {
      return Promise.reject(error);
    }
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/cecos" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/cecos"
          element={
            isLoggedIn ? (
              <Cecos onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/puestos"
          element={
            isLoggedIn ? (
              <ResourceGroups onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/actividades"
          element={
            isLoggedIn ? (
              <Activities onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/encuestas"
          element={
            isLoggedIn ? (
              <Encuestas onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/administracion"
          element={
            isLoggedIn ? (
              <Users onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/totales"
          element={
            isLoggedIn ? (
              <TotalReports onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
 