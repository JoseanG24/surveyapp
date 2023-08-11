  import React, { useState, useEffect } from "react";
  import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
  import Login from "./login.js";
  import Home from "./home.js";

  const App = () => {
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

    
    return (
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <Home onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/home" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
        </Routes>
      </Router>
    );
  }

  export default App;

  