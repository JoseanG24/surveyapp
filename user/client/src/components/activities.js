import React, { useState, useEffect } from 'react';
import styles from '../styles/activities.module.css';

const Activities = ({ onReturn, Role }) => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (Role) {
      fetch(`http://localhost:4000/activities?Role=${Role}`)
        .then((response) => response.json())
        .then((data) => {
          setActivities(data);
        })
        .catch((error) => {
          console.error("Error al obtener las actividades:", error);
        });
    }
  }, [Role]);

  const handleReturn = () => {
    onReturn();
  };

  return (
    <div className={styles.container}>
      <button className={styles.returnButton} onClick={handleReturn}>
        Regresar
      </button>
      <h3 className={styles.title}>Aquí puedes ver cuáles son tus tareas</h3>
      <br />

      <div className={styles.activityContainer}>
        {activities.length === 0 ? (
          <p>Cargando actividades...</p>
        ) : (
          activities.map((activity, key) => (
            <div className={styles.activity} key={key}>
              <p><b>Su actividad:</b> {activity.Name}</p>
              <p>{activity.Description}</p>
              <p className={styles.Tip}><b>Tip: </b>{activity.Tip}</p>
              <p className={styles.Code}>Código: {activity.Code}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Activities;
