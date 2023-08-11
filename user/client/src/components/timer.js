import React, { useEffect, useState } from 'react';
import styles from '../styles/timer.module.css';
import axios from 'axios';

function Timer({ onReturn, Role }) {
  const [activities, setActivities] = useState([]);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activeSurvey, setActiveSurvey] = useState(false);
  const [selectedConfirmBtn, setSelectedConfirmBtn] = useState(null)

  // Codigos para enviar en el timestamp
  const [userCode, setUserCode] = useState([]);
  const [surveyCode, setSurveyCode] = useState([]);

  // Iniciar el cronometro
  const handleStartStop = () => {
    if (isRunning) {
      setIsConfirmationOpen(true);
    } else {
      setIsRunning(true);
    }
  };

  // Terminar el cronometro
  const handleConfirmation = (confirmed) => {
    setIsConfirmationOpen(false);
  
    if (confirmed) {
      setIsRunning(false);
      setTime(0);
  
      if (selectedActivity) {
        const timestamp = formatTime(time);
        const requestData = {
          timestamp,
          surveyCode: surveyCode[0].Code,
          userCode: userCode[0].Code,
          activityCode: selectedActivity.Code,
        };
  
        axios
          .post('http://localhost:4000/times', requestData, {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((response) => {
            // Handle the response if necessary
          })
          .catch((error) => {
            console.error('Error al enviar el tiempo:', error);
          });
      } else {
        // Handle the case when selectedActivity is null (e.g., "Finalizar" button pressed)
        const timestamp = formatTime(time);
        const requestData = {
          timestamp,
          surveyCode: surveyCode[0].Code,
          userCode: userCode[0].Code,
          activityCode: null,
        };
  
        axios
          .post('http://localhost:4000/times', requestData, {
            headers: { 'Content-Type': 'application/json' },
          })
          .then((response) => {
            // Handle the response if necessary
          })
          .catch((error) => {
            console.error('Error al enviar el tiempo:', error);
          });
      }
    } else {
      setIsRunning(true);
    }
  };
  

  // Convertir el tiempo en formato HH:MM:SS
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}`;
  };

  // Verificar si hay alguna encuesta activada
  useEffect(() => {
    fetch('http://localhost:4000/active-survey')
      .then((response) => response.json())
      .then((data) => {
        setActiveSurvey(data.some((survey) => survey.Active === 1));
      })
      .catch((error) => {
        console.error('Error al obtener el estado de las encuestas:', error);
      });
  }, []);

  // Obtener las actividades basadas en el rol del usuario
  useEffect(() => {
    if (Role) {
      fetch(`http://localhost:4000/activities?Role=${Role}`)
        .then((response) => response.json())
        .then((data) => {
          setActivities(data);
        })
        .catch((error) => {
          console.error('Error al obtener las actividades:', error);
        });
    }
  }, [Role]);

  // Obtener el codigo de la encuesta que esta activa
  useEffect(() => {
    fetch('http://localhost:4000/survey-code?Active=1')
      .then((response) => response.json())
      .then((data) => {
        setSurveyCode(data);
      })
      .catch((error) => {
        console.error('Error al obtener el código de la encuesta activa:', error);
      });
  }, []);

  // Obtener el codigo del usuario basado en su Rol
  useEffect(() => {
    if (Role) {
      fetch(`http://localhost:4000/user-code?Role=${Role}`)
        .then((response) => response.json())
        .then((data) => {
          setUserCode(data);
        })
        .catch((error) => {
          console.error('Error al obtener el código del usuario:', error);
        });
    }
  }, [Role]);

  // Actualizar el cronometro
  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        setSelectedActivity(null); // Restablecer selectedActivity a null
        setSelectedConfirmBtn(false); //Restablecer el boton de confirm
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  // Enviar un timestamp al servidor
  useEffect(() => {
    if (selectedActivity) {
      const timestamp = formatTime(time)  ;
      const requestData = {
        timestamp,
        surveyCode: surveyCode[0].Code,
        userCode: userCode[0].Code,
        activityCode: selectedActivity.Code,
      };

      axios
        .post('http://localhost:4000/times', requestData, {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          // Manejar la respuesta si es necesario
        })
        .catch((error) => {
          console.error('Error al enviar el tiempo:', error);
        });
    }
  }, [selectedActivity]);

  // Obtener la actividad a la que se dio click
  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  // Regresar a Home
  const handleReturn = () => {
    onReturn();
  };

  return (
    <>
      <div className={styles.main}>
        {!isRunning && (
          <button className={styles.returnButton} onClick={handleReturn}>
            Regresar
          </button>
        )}

        <div className={styles.header}>
          {!activeSurvey ? (
            <p>No hay ninguna encuesta activa, regrese más tarde.</p>
          ) : (
            <>
              <div className={styles.time}>{formatTime(time)}</div>

              <button
                className={styles.startStop}
                onClick={handleStartStop}
                style={{ backgroundColor: isRunning ? 'red' : 'green' }}
                disabled={!activeSurvey}
              >
                {isRunning ? 'Finalizar' : 'Iniciar'}
              </button>

              {isConfirmationOpen && (
                <div className={styles.confirmDialog}>
                  <p>¿Está seguro de que deseas finalizar el cronómetro?</p>
                  <div className={styles.dialogbtnContainer}>
                    <button
                      className={styles.confirmButton}
                      onClick={() => {handleConfirmation(true); setSelectedConfirmBtn(true)}}
                    >
                      Confirmar
                    </button>
                    <button
                      className={styles.cancelButton}
                      onClick={() => handleConfirmation(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {isRunning && (
          <div className={styles.activityContainer}>
            {activities.length === 0 ? (
              <p>Cargando actividades...</p>
            ) : (
              <div className={styles.activitiesGrid}>
                {activities.map((activity, key) => (
                  <button
                    className={`${styles.activity} ${selectedActivity === activity ? styles.activitySelected : ''}`}
                    key={key}
                    onClick={() => handleActivityClick(activity)}
                  >
                    {activity.Name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Timer;
