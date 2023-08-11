import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import styles from "../styles/encuestas.module.css";

const Encuestas = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [surveys, setSurveys] = useState([]);
  const [activeSurveyCode, setActiveSurveyCode] = useState(null);

  const handleLogout = () => {
    onLogout();
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCode("");
    setNumber("");
    setDescription("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Validar que se hayan ingresado los valores requeridos
    if (!code || !number || !description) {
      alert("Por favor ingresa todos los valores requeridos");
      return;
    }

    // Crear el objeto de la nueva encuesta
    const newSurvey = {
      Code: code,
      Number: number,
      Description: description,
    };

    // Enviar los datos al servidor mediante una solicitud POST usando Axios
    axios
      .post("http://localhost:5000/encuestas", newSurvey)
      .then((response) => {
        console.log("Encuesta creada exitosamente");
        alert("Formulario enviado con éxito");
        closeModal();
      })
      .catch((error) => {
        console.error("Error al crear la encuesta:", error);
        alert("Error al enviar el formulario");
      });

      window.location.reload();
  };

  const activateSurvey = (code) => {
    axios
      .post("http://localhost:5000/activar", { Code: code })
      .then((response) => {
        console.log("Encuesta activada exitosamente");
        // Actualizar el estado de las encuestas para reflejar el cambio
        const updatedSurveys = surveys.map((survey) => {
          if (survey.Code === code) {
            return {
              ...survey,
              Active: 1,
            };
          }
          return survey;
        });
        setSurveys(updatedSurveys);
        setActiveSurveyCode(code);
      })
      .catch((error) => {
        console.error("Error al activar la encuesta:", error);
        alert("Error al activar la encuesta");
      });
  };

  const deactivateSurvey = (code) => {
    axios
      .post("http://localhost:5000/desactivar", { Code: code })
      .then((response) => {
        console.log("Encuesta desactivada exitosamente");
        // Actualizar el estado de las encuestas para reflejar el cambio
        const updatedSurveys = surveys.map((survey) => {
          if (survey.Code === code) {
            return {
              ...survey,
              Active: 0,
            };
          }
          return survey;
        });
        setSurveys(updatedSurveys);
        setActiveSurveyCode(null);
        window.location.reload(); // Recargar la página
      })
      .catch((error) => {
        console.error("Error al desactivar la encuesta:", error);
        alert("Error al desactivar la encuesta");
      });
  };

  useEffect(() => {
    fetch("http://localhost:5000/encuestas")
      .then((response) => response.json())
      .then((data) => {
        setSurveys(data);
        const activeSurvey = data.find((survey) => survey.Active === 1);
        if (activeSurvey) {
          setActiveSurveyCode(activeSurvey.Code);
        }
      });
  }, []);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <Header />
          <button onClick={handleLogout} className={styles.logout}>
            Salir
          </button>
        </div>

        {showModal && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <span className={styles.close} onClick={closeModal}>
                &times;
              </span>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label htmlFor="code">Código:</label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="number">Numero:</label>
                  <input
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="description">Descripcion:</label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <button className={styles.submitButton} type="submit">
                    Enviar
                  </button>
                  <button
                    className={styles.cancelButton}
                    type="button"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div>
          <h2>Encuestas:</h2>

          <button className={styles.createButton} onClick={openModal}>
            Crear nueva encuesta
          </button>

          {surveys.map((survey) => (
            <div key={survey.id} className={styles.surveyContainer}>
              <p className={styles.surveyInfo}>Código: {survey.Code}</p>
              <p className={styles.surveyInfo}>Numero: {survey.Number}</p>
              <p className={styles.surveyInfo}>
                Descripcion: {survey.Description}
              </p>
              {survey.Active === 1 ? (
                <button className={styles.actionButton} disabled>
                  Activar
                </button>
              ) : (
                <button
                  className={styles.actionButton}
                  onClick={() => {
                    activateSurvey(survey.Code);
                    window.location.reload(); 
                  }}
                  disabled={activeSurveyCode !== null}
                >
                  Activar
                </button>
              )}
              {survey.Active === 0 ? (
                <button className={styles.actionButton} disabled>
                  Desactivar
                </button>
              ) : (
                <button
                  className={styles.actionButton}   
                  onClick={() => {
                    deactivateSurvey(survey.Code);
                    window.location.reload(); 
                  }}
                  disabled={activeSurveyCode !== survey.Code}
                >
                  Desactivar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Encuestas;
