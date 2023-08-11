import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "./styles/homeComponent.module.css";
import Instructions from "./components/instructions";
import Timer from './components/timer';
import Activities from './components/activities';

const Home = ({ onLogout }) => {
  const location = useLocation();
  const userUsername = location.state?.userUsername;
  const userPassword = location.state?.userPassword;

  const [showInstructions, setShowInstructions] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/user-role?username=${userUsername}&password=${userPassword}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setUserRole(data[0]?.Role);
          setUserAuthenticated(true);
        } else {
          setUserAuthenticated(false);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el rol del usuario:", error);
        setUserAuthenticated(false);
      });
  }, [userUsername, userPassword]);

  const logoutFunction = () => {
    onLogout();
  };

  const handleInstructionsClick = () => {
    setShowInstructions(true);
    setShowTimer(false);
    setShowActivities(false);
  };

  const handleTimerClick = () => {
    setShowInstructions(false);
    setShowTimer(true);
    setShowActivities(false);
  };

  const handleActivitiesClick = () => {
    setShowInstructions(false);
    setShowTimer(false);
    setShowActivities(true);
  };

  const handleReturn = () => {
    setShowInstructions(false);
    setShowTimer(false);
    setShowActivities(false);
  };

  return (
    <>
      {!userAuthenticated && (
        <div className={styles.main}>
          <button onClick={logoutFunction} className={styles.logout}>
            Salir
          </button>
          <img className={styles.logo} src="/biconlogo.png" alt="bicon" />
          <div className={styles.header}>
            <h1 className={styles.title}>
              ¡Bienvenido a <span>BiCon Survey!</span>
            </h1>
          </div>
          <p className={styles.errorMessage}>
            No se ha ingresado ni autenticado ningún usuario, por favor salir y volver a ingresar.
          </p>
        </div>
      )}

      {userAuthenticated && !showInstructions && !showTimer && !showActivities && (
        <div className={styles.main}>
          <button onClick={logoutFunction} className={styles.logout}>
            Salir
          </button>
          <img className={styles.logo} src="/biconlogo.png" alt="bicon" />
          <div className={styles.header}>
            <h1 className={styles.title}>
              ¡Bienvenido a <span>BiCon Survey!</span>
            </h1>
            {userUsername && (
              <h3 className={styles.username}>
                {userUsername}
              </h3>
            )}
            {userRole && (
              <h3>
                Grupo: {userRole}
              </h3>
            )}
          </div>

          <div className={styles.optionContainer}>
            <p className={styles.instructions} onClick={handleInstructionsClick}>
              Instrucciones
            </p>
            <p className={styles.activities} onClick={handleActivitiesClick}>
              Actividades
            </p>
            <p className={styles.surveys} onClick={handleTimerClick}>
              Encuesta
            </p>
          </div>
        </div>
      )}

      {userAuthenticated && showInstructions && <Instructions onReturn={handleReturn} />}
      {userAuthenticated && showTimer && <Timer Role={userRole} onReturn={handleReturn} />}
      {userAuthenticated && showActivities && <Activities Role={userRole} onReturn={handleReturn} />}
    </>
  );
};

export default Home;
