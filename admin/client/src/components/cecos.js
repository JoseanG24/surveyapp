import React, { useState, useEffect } from "react";
import styles from "../styles/cecos.module.css";
import Header from "./header";

const Cecos = ({ onLogout }) => {
  const [cecos, setCecos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usuariosCecos, setUsuariosCecos] = useState({});
  const [selectedCeco, setSelectedCeco] = useState(null);
  const [cecoHijos, setCecoHijos] = useState([]);

  //Obtener tokens de acceso
  const getAccessToken = () => {
    return localStorage.getItem("accesToken")
  }

  //Obtener todos los centros de costo
  useEffect(() => {
    fetch("http://localhost:5000/cecos")
      .then((response) => response.json())
      .then((data) => {
        setCecos(data);
      });
  }, []);

  //capturar el valor del input para buscar
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //Filtrar los centros de costo en base a lo que el usuario esté buscando
  const filteredCecos = cecos.filter((ceco) =>
    ceco.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //Obtener los usuarios correspondientes al centro de costo seleccionado
  const getCecoUsuarios = (ceco) => {
    fetch(`http://localhost:5000/users_cecos?Ceco=${ceco.Code}`)
      .then((response) => response.json())
      .then((data) => {
        setUsuariosCecos((prevState) => ({
          ...prevState,
          [ceco.Code]: data,
        }));
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios del centro de costo:", error);
      });
  };

  //Obtener el centro de costo que ha sido seleccionado
  const handleClickCeco = (ceco) => {
    if (selectedCeco === ceco.Code) {
      setSelectedCeco(null);
      
    } else {
      setSelectedCeco(ceco.Code);
      if (!usuariosCecos[ceco.Code]) {
        getCecoUsuarios(ceco);
      }
    }
  };

  //log out
  const handleLogout = () => {
    onLogout();
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
          <p className={styles.title}>📂Cátalogo Centro de Costos</p>

          <div className={styles.secondBody}>
            <div className={styles.cecosContainer}>
              <div className={styles.secondHeader}>
                <input
                  type="text"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={handleSearch}
                  className={styles.input}
                />
              </div>  

              <div className={styles.cecos}>
                {filteredCecos.length === 0 ? (
                  <p className={styles.noCecos}>La tabla está vacía</p>
                ) : (
                  filteredCecos.map((ceco) => (
                    <button
                      className={`${styles.cecoButton} ${
                        selectedCeco === ceco.Code ? styles.activeCeco : ""
                      }`}
                      onClick={() => handleClickCeco(ceco)}
                      key={ceco.Code}
                    >
                      <span className={styles.cecoName}>Nombre: {ceco.Name}</span>
                      <span className={styles.cecoCode}>Código:{ceco.Code}</span>
                      <span className={styles.cecoParent}>{ceco.Parent}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className={styles.usersContainer}>
              {selectedCeco && (
                <>
                  {usuariosCecos[selectedCeco] &&
                    usuariosCecos[selectedCeco].length > 0 ? (
                    usuariosCecos[selectedCeco].map((usuario, i) => (
                      <div className={styles.userContainer} key={i}>
                        <div className={styles.userContent}>
                          <p>
                            <span className={styles.userLabel}>Centro de costo: {usuario.Ceco}</span>{" "}
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
};

export default Cecos;
