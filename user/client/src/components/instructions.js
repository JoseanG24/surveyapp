import React, { useState } from 'react';
import styles from '../styles/instructions.module.css';

const Instructions = ({ onReturn }) => {
  
  const handleReturn = () => {
    onReturn();
  };

  return (
    <>
      <div className={styles.main}>
        <button className={styles.returnButton} onClick={handleReturn}>
          Regresar
        </button>

        <h1 className={styles.title}>Instrucciones</h1>

        <p className={styles.instructionsText}>
          <b>Bicon Survey</b> es una solución que permite a los colaboradores identificar las actividades que se realizan y asignarles un peso que refleje la intensidad con la que ejecutan.
          <p>
          Usted como empleado deberá revisar las actividades que tiene en la pestaña de "Actividades". Luego de ver sus tareas o actividades asignadas del día, debe ir a la pestaña "Encuesta" donde se le presentara un temporizador. 
        </p>
        <p>
          Al iniciar el temporizador usted debe ir realizando sus actividades o tareas diarias de su puesto de trabajo, sin embargo al terminar alguna de esas actividades usted debe dar click al botón con el nombre de la actividad que realizo, de esta manera guardando un registro de el tiempo tomado en realizar dicha actividad.
        </p>
        <p>
          El temporizador no debe finalizarse hasta que usted termine su día laboral.
        </p>
        </p>
       
      </div>
    </>
  );
};

export default Instructions;