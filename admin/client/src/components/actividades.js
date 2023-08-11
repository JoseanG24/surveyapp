import React, { useEffect, useState } from "react";
import Header from "./header";
import styles from "../styles/actividades.module.css";

const Activities = ({ onLogout }) => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/actividades")
      .then((response) => response.json())
      .then((data) => {
        setActivities(data);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogout = () => {
    onLogout();
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedType === "" || activity.Type === selectedType)
  );

  const uniqueTypes = [...new Set(activities.map((activity) => activity.Type))];

  const handleTypeFilter = (type) => {
    setSelectedType(type);
  };

  return (
    <>
      <div className={styles.main}>
        <div className={styles.mainHeader}>
          <Header />
          <button onClick={handleLogout} className={styles.logout}>
            Salir
          </button>
        </div>

        <div className={styles.body}>
          <p className={styles.title}>📂Cátalogo Actividades y Procesos</p>
          <div className={styles.activityContainer}>
            <div>
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={searchTerm}
                onChange={handleSearch}
                className={styles.input}
              />
            </div>

            <div className={styles.typeButtons}>
              <button
                className={`${styles.typeButton} ${
                  selectedType === "" ? styles.active : ""
                }`}
                onClick={() => handleTypeFilter("")}
              >
                Todos
              </button>
              {uniqueTypes.map((type) => (
                <button
                  key={type}
                  className={`${styles.typeButton} ${
                    selectedType === type ? styles.active : ""
                  }`}
                  onClick={() => handleTypeFilter(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {filteredActivities.length === 0 ? (
              <p className={styles.emptyMessage}>No se encontraron actividades.</p>
            ) : (
              <div className={styles.activities}>
                {filteredActivities.map((activity) => (
                  <div key={activity.Code} className={styles.activity}>
                    <h3 className={styles.activityTitle}>{activity.Name}</h3>
                    <p className={styles.activityDescription}>{activity.Description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Activities;
