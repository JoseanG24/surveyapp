import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Header = () => {
  //Otros estados
  const [openSection, setOpenSection] = useState(null);
  const [tableName, setTableName] = useState("");
  const [userValues, setUserValues] = useState({
    excelFilePath: "",
  });

  //Estados para mostrar/ocultar
  const [showInstructions, setShowInstructions] = useState(false);
  const [showImportSection, setShowImportSection] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showLoadingText, setShowLoadingText] = useState(false);

  // Estados para rastrear si las tablas de "Cecos", "Puestos" y "Actividades" han sido importadas
  const [cecosImported, setCecosImported] = useState(false);
  const [puestosImported, setPuestosImported] = useState(false);
  const [actividadesImported, setActividadesImported] = useState(false);

  const handleSectionClick = (sectionId) => {
    if (sectionId === "import") {
      setShowInstructions(true);
      setShowImportSection(false);
    } else {
      if (openSection === sectionId) {
        setOpenSection(null);
      } else {
        setOpenSection(sectionId);
      }
    }
  };

  const handleNextClick = () => {
    setShowInstructions(false);
    setShowImportSection(true);
  };

  const handleImport = async (tableName) => {
    // Verificar si las tablas de "Cecos", "Puestos" y "Actividades" han sido importadas
    if (
      (tableName === "Usuarios" && (!cecosImported || !puestosImported)) ||
      (tableName === "Actividades" && (!puestosImported))
    ) {
      alert("Debes importar primero las tablas de 'Cecos', 'Puestos' y 'Actividades' antes de importar la tabla de 'Usuarios' o 'Actividades'.");
      return;
    }

    const usersUrl = "http://localhost:5000/import-users";
    const cecosUrl = "http://localhost:5000/import-cecos";
    const rgUrl = "http://localhost:5000/import-rg";
    const activitiesUrl = "http://localhost:5000/import-activities";

    try {
      let response;

      switch (tableName) {
        case "Usuarios":
          response = await axios.post(usersUrl, {
            excelFilePath: userValues.excelFilePath,
          });
          console.clear();
          console.log(response.data);
          setShowImportSuccess(true);
          setShowImportSection(false);
          setShowLoadingText(false);
          break;
        case "Cecos":
          response = await axios.post(cecosUrl, {
            excelFilePath: userValues.excelFilePath,
          });
          console.clear();
          console.log(response.data);
          setShowImportSuccess(true);
          setShowImportSection(false);
          setShowLoadingText(false);
          setCecosImported(true);
          break;
        case "Puestos":
          response = await axios.post(rgUrl, {
            excelFilePath: userValues.excelFilePath,
          });
          console.clear();
          console.log(response.data);
          setShowImportSuccess(true);
          setShowImportSection(false);
          setShowLoadingText(false);
          setPuestosImported(true);
          break;
        case "Actividades":
          response = await axios.post(activitiesUrl, {
            excelFilePath: userValues.excelFilePath,
          });
          console.clear();
          console.log(response.data);
          setShowImportSuccess(true);
          setShowImportSection(false);
          setShowLoadingText(false);
          setActividadesImported(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.clear();
      console.log(error.response.data);
    }
  };

  return (
    <>
      <header id="header">
        <img src="/biconlogo2.png" alt="bicon" />

        <nav>
          <ul>
            <li
              id="catalogos"
              className={`seccion ${
                openSection === "catalogos" ? "open" : ""
              }`}
            >
              <h4 onClick={() => handleSectionClick("catalogos")}>Catálogos</h4>
              <ul className="sub_list">
                <li className="sub">
                  <Link to={"/cecos"}>Centros de Costo</Link>
                </li>
                <li className="sub">
                  <Link to={"/puestos"}>Puestos</Link>
                </li>
                <li className="sub">
                  <Link to={"/actividades"}>Actividades</Link>
                </li>
              </ul>
            </li>
            <li
              id="encuestas"
              className={`seccion ${
                openSection === "encuestas" ? "open" : ""
              }`}
            >
              <h4 onClick={() => handleSectionClick("encuestas")}>Encuestas</h4>
              <ul className="sub_list">
                <li className="sub">
                  <Link to={"/encuestas"}>Encuestas</Link>
                </li>
              </ul>
            </li>
            <li
              id="reportes"
              className={`seccion ${
                openSection === "reportes" ? "open" : ""
              }`}
            >
              <h4 onClick={() => handleSectionClick("reportes")}>Reportes</h4>
              <ul className="sub_list">
                <li className="sub">
                  <Link to={"/totales"}>Totales</Link>
                </li>
              </ul>
            </li>
            <li
              id="administracion"
              className={`seccion ${
                openSection === "administracion" ? "open" : ""
              }`}
            >
              <h4 onClick={() => handleSectionClick("administracion")}>
                Administración
              </h4>
              <ul className="sub_list">
                <li className="sub">
                  <Link to={"/administracion"}>Usuarios</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <button onClick={() => handleSectionClick("import")} id="import">
          Importar tabla
        </button>
      </header>

      {/* Pop-up de instrucciones */}
      {showInstructions && (
        <div className="pop">
          <div className="popContent">
            <div>
              <button
                className="cancelBtn"
                onClick={() => setShowInstructions(false)}
              >
                Cancelar
              </button>
              <h3>Instrucciones para importar una tabla desde excel</h3>
              <p>
                <p>
                  A continuación se muestran los nombres y las columnas que
                  debe tener cada tabla para que nuestro sistema pueda
                  importarlas correctamente (las columnas también deben ir en
                  el orden especificado):
                </p>
                <b>¿Qué tabla deseas insertar?</b>
              </p>
              <ul className="nombres-tablas">
                <li>
                  <h4
                    onClick={() => {
                      setTableName("Cecos");
                      handleNextClick();
                    }}
                    className="tableName"
                  >
                    Centros de Costo
                  </h4>
                  <ol className="nombres-columnas">
                    <li>
                      Nombre de la hoja: <b>"Centros de Costo"</b>
                    </li>
                    <li>
                      Columna del código/id del centro de costo: <b>"Code"</b>
                    </li>
                    <li>
                      Columna con el nombre del centro de costo: <b>"Name"</b>
                    </li>
                    <li>
                      Columna con código/ID del usuario o padre: <b>"Parent"</b>
                    </li>
                  </ol>
                </li>

                <li>
                  <h4
                    onClick={() => {
                      setTableName("Puestos");
                      handleNextClick();
                    }}
                    className="tableName"
                  >
                    Puestos o Grupos de Recursos
                  </h4>
                  <ol className="nombres-columnas">
                    <li>
                      Nombre de la hoja: <b>"Puestos"</b>
                    </li>
                    <li>
                      Columna del código/id del puesto o grupo de recursos:{" "}
                      <b>"Code"</b>
                    </li>
                    <li>
                      Columna con el nombre del puesto: <b>"Name"</b>
                    </li>
                    <li>
                      Columna con el código/id del usuario o padre:{" "}
                      <b>"Parent"</b>
                    </li>
                  </ol>
                </li>

                <li>
                  <h4
                    onClick={() => {
                      setTableName("Usuarios");
                      handleNextClick();
                    }}
                    className="tableName"
                  >
                    Usuarios
                  </h4>
                  <ol className="nombres-columnas">
                    <li>
                      Nombre de la hoja: <b>"Usuarios"</b>
                    </li>
                    <li>
                      Columna del código/id del usuario: <b>"Code"</b>
                    </li>
                    <li>
                      Columna con el nombre completo del usuario:{" "}
                      <b>"Name"</b>
                    </li>
                    <li>
                      Columna con el nombre de usuario: <b>"Username"</b>
                    </li>
                    <li>
                      Columna con la contraseña del usuario: <b>"Password"</b>
                    </li>
                    <li>
                      Columna con el centro de costo del usuario:{" "}
                      <b>"Ceco"</b>
                    </li>
                    <li>
                      Columna con el puesto del usuario: <b>"Role"</b>
                    </li>
                    <li>
                      Columna con el tipo de usuario (S:Admin, N:Usuario):{" "}
                      <b>"Type"</b>
                    </li>
                  </ol>
                </li>

                <li>
                  <h4
                    onClick={() => {
                      setTableName("Actividades");
                      handleNextClick();
                    }}
                    className="tableName"
                  >
                    Actividades o tareas
                  </h4>
                  <ol className="nombres-columnas">
                    <li>
                      Nombre de la hoja: <b>"Actividades"</b>
                    </li>
                    <li>
                      Columna del código/id de la actividad: <b>"Code"</b>
                    </li>
                    <li>
                      Columna con el nombre actividad: <b>"Name"</b>
                    </li>
                    <li>
                      Columna con el tipo de actividad: <b>"Type"</b>
                    </li>
                    <li>
                      Columna con la etiqueta o label de la actividad:{" "}
                      <b>"Label"</b>
                    </li>
                    <li>
                      Columna con el tip o recomendación para la actividad:{" "}
                      <b>"Tip"</b>
                    </li>
                    <li>
                      Columna con el código del grupo al que pertenece la
                      actividad: <b>"Role"</b>
                    </li>
                    <li>
                      Columna con la descripción de la actividad:{" "}
                      <b>"Description"</b>
                    </li>
                  </ol>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up de importación */}
      {showImportSection && (
        <div className="pop">
          <div className="popContent">
            <p>Para importar su tabla, ingrese la ruta de archivo de la misma.</p>
            <p>
              * Al introducir la dirección de la tabla omitir el tipo de archivo
              (".xlsx")
            </p>
            <h4>Para obtener la dirección de su archivo:</h4>
            <ol>
              {/* ... Pasos para obtener la dirección del archivo ... */}
            </ol>
            <input
              type="text"
              placeholder="Dirección del archivo"
              value={userValues.excelFilePath}
              onChange={(event) =>
                setUserValues({ excelFilePath: event.target.value })
              }
            />
            {showLoadingText && !(
              (tableName === "Usuarios" && (!cecosImported || !puestosImported)) ||
              (tableName === "Actividades" && (!puestosImported))
            ) && (
              <div className="loadingMessage">
                Importando los datos, esto puede llegar a tomar unos minutos...
              </div>
            )}
            <div className="popButtonContainer">
              <button
                className="popButton"
                onClick={() => {
                  handleImport(tableName);
                  setShowLoadingText(true);
                }}
              >
                Importar
              </button>
              <button
                className="popButton"
                onClick={() => {
                  setShowImportSection(false);
                  setShowLoadingText(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito de importación */}
      {showImportSuccess && (
        <div className="successMessageBackground">
          <div className="successMessageContent">
            La tabla se importó exitosamente.
            <button
              onClick={() => setShowImportSuccess(false)}
              className="popButton"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
 