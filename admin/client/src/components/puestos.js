import React, { useEffect, useState } from "react";
import styles from '../styles/puestos.module.css'
import Header from "./header";

const ResourceGroups = ({ onLogout }) => {

    const [resourceGroups, setResourceGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [usersRg, setUsersRg] = useState([]);
    const [selectedRg, setSelectedRg] = useState(null);

    //obtener los datos
    useEffect(() => {
        fetch("http://localhost:5000/puestos")
          .then((response) => response.json())
          .then((data) => {
            setResourceGroups(data);
          });
      }, []);

      //capturar el valor del input para la funcion de busqueda
      const handleSearch = (event) => {
        setSearchTerm(event.target.value);
      }

      //Filtrar los puestos en base a la busqueda
      const filteredResourceGroups = resourceGroups.filter((rg) => 
        rg.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )


    //Obtener los usuarios correspondientes a un puesto
    const getRgUsers = (rg) => {
      fetch(`http://localhost:5000/users_rg?Role=${rg.Code}`)
        .then((response) => response.json())
        .then((data) => {
          setUsersRg((prevState) => ({
            ...prevState,
            [rg.Code]: data,
          }));
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios del centro de costo:", error);
        });
    };

    //Obtener el centro de costos que ha sido seleccionado
    const handleClickResourceGroup = (rg) => {
      if (selectedRg == rg.Code) {
        setSelectedRg(null);
      } else {
        setSelectedRg(rg.Code);
        if (!usersRg[rg.Code]) {
          getRgUsers(rg);
        }
      }
    }

    //log out
    const handleLogout = () => onLogout();

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
          <p className={styles.title}>📂Cátalogo Puestos y Grupos de Recursos</p>

          <div className={styles.secondBody}>
            <div className={styles.rgContianer}>
              <div className={styles.secondHeader}>
                <input
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={handleSearch}
                  className={styles.input}
                />
              </div>  

              <div className={styles.rgs}>
                {filteredResourceGroups.length === 0 ? (
                  <p className={styles.noRgs}>La tabla está vacía</p>
                ) : (
                  filteredResourceGroups.map((rg) => (
                    <button
                      className={`${styles.rgButton} ${
                        selectedRg === rg.Code ? styles.activeRg : ""
                      }`}
                      onClick={() => handleClickResourceGroup(rg)}
                      key={rg.Code}
                    >
                      <span className={styles.rgName}>Nombre: {rg.Name}</span>
                      <span className={styles.rGCode}>Código:{rg.Code}</span>
                      <span className={styles.rgParent}>{rg.Parent}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className={styles.usersContainer}>
              {selectedRg && (
                <>
                  {usersRg[selectedRg] &&
                    usersRg[selectedRg].length > 0 ? (
                    usersRg[selectedRg].map((usuario, i) => (
                      <div className={styles.userContainer} key={i}>
                        <div className={styles.userContent}>
                          <p>
                            <span className={styles.userLabel}>Centro de costo: {usuario.Role}</span>{" "}
                          </p>
                          <p>
                            <span className={styles.userLabel}>Nombre completo:</span>{" "}
                            {usuario.Name}
                          </p>
                          <p>
                            <span className={styles.userLabel}>Usuario:</span>{" "}
                            {usuario.Username}
                          </p>
                          <p>
                            <span className={styles.userLabel}>Puesto:</span>{" "}
                            {usuario.Role}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noUsers}>
                      No hay usuarios asignados a este centro de costo.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
    );
}


export default ResourceGroups;