import React, { useState, useEffect } from "react";
import Header from "./header";
import styles from '../styles/reportes.module.css';

const TotalReports = ({ onLogout }) => {
  const [reports, setReports] = useState([]); // guardar los reportes obtenidos
  const [activities, setActivities] = useState([]); // guardar info de procesos y actividades
  const [users, setUsers] = useState([]); // guardar info de los usuarios
  const [surveys, setSurveys] = useState([]); // guardar información de las encuestas
  const [searchTerm, setSearchTerm] = useState(""); // Estado para almacenar el término de búsqueda
  const [searchResults, setSearchResults] = useState([]); // Estado para almacenar los resultados de búsqueda

  // Obtener los reportes de los tiempos
  useEffect(() => {
    fetch("http://localhost:5000/reportes")
      .then((response) => response.json())
      .then((data) => {
        setReports(data);
      });
  }, []);

  // Obtener info de los centros de costo
  useEffect(() => {
    fetch("http://localhost:5000/actividades")
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

  // Obtener info de los usuarios
  useEffect(() => {
    fetch("http://localhost:5000/login")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  // Obtener info de las encuestas
  useEffect(() => {
    fetch("http://localhost:5000/encuestas")
      .then((response) => response.json())
      .then((data) => {
        setSurveys(data);
      });
  }, []);

  // Log out
  const handleLogout = () => {
    onLogout();
  };

  // Función para formatear la fecha y hora en formato "00:00:00"
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Función para obtener el nombre de la actividad usando el código del proceso
  const getActivityName = (processCode) => {
    const activity = activities.find((activity) => activity.Code === processCode);
    return activity ? activity.Name : "Final";
  };

  // Función para obtener el nombre del usuario usando el código del usuario
  const getUserName = (userCode) => {
    const user = users.find((user) => user.Code === userCode);
    return user ? user.Name : "Usuario Desconocido";
  };

  // Función para obtener el nombre de la encuesta usando el código de encuesta
  const getSurveyName = (surveyCode) => {
    const survey = surveys.find((survey) => survey.Code === surveyCode);
    return survey ? survey.Description : "Encuesta Desconocida";
  };

  // Función para obtener el Ceco del usuario usando el código del usuario
  const getUserCeco = (userCode) => {
    const user = users.find((user) => user.Code === userCode);
    return user ? user.Ceco : "Ceco Desconocido";
  };

  // Función para obtener el Role del usuario usando el código del usuario
  const getUserRole = (userCode) => {
    const user = users.find((user) => user.Code === userCode);
    return user ? user.Role : "Role Desconocido";
  };

  // Función para realizar la búsqueda
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  // Filtrar los resultados de la búsqueda
  useEffect(() => {
    const filteredResults = reports.filter((report) => {
      const surveyName = getSurveyName(report.Survey).toLowerCase();
      return surveyName.includes(searchTerm.toLowerCase());
    });
    setSearchResults(filteredResults);
  }, [searchTerm, reports]);

  return (
    <div className={styles.main}>
      <div className={styles.mainHeader}>
        <Header />
        <button onClick={handleLogout} className={styles.logout}>
          Salir
        </button>
      </div>

      <div className={styles.body}>
        <p className={styles.title}>📂Reportes</p>

        {/* Agregar barra de búsqueda */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Buscar por nombre de encuesta"
          className={styles.searchInput}
        />

        <table className={styles.reportTable}>
          <thead>
            <tr>
              <th>Código de Encuesta</th>
              <th>Nombre de Encuesta</th>
              <th>Código de Usuario</th>
              <th>Nombre de Usuario</th>
              <th>Código Centro de Costo</th>
              <th>Código Puesto</th>
              <th>Código de Actividad</th>
              <th>Nombre de Actividad</th>
              <th>Tiempos Registrados</th>
            </tr>
          </thead>
          <tbody>

            {searchResults.map((report, index) => (
              <tr key={index}>
                <td>{report.Survey}</td>
                <td>{getSurveyName(report.Survey)}</td>
                <td>{report.UserCode}</td>
                <td>{getUserName(report.UserCode)}</td>
                <td>{getUserCeco(report.UserCode)}</td>
                <td>{getUserRole(report.UserCode)}</td>
                <td>{report.Process || "Final del cronómetro"}</td>
                <td>{getActivityName(report.Process)}</td>
                <td>{formatTime(report.Timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TotalReports;
