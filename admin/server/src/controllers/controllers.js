import { getConnection } from "../database/connection";
import config from "../config";
import { queriesUsers, queriesCecos, queriesResourceGroups, queriesSurveys, queriesActivities, queriesTimes } from "../database/queries"; 
import jwt from 'jsonwebtoken';

//Mostrar usuarios 
export const showUsers = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesUsers.getUsers);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

//Validar e ingresar usuarios (solo administradores)
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; 

    const pool = await getConnection(); 
    const result = await pool
      .request()
      .input("username", username) 
      .input("password", password) 
      .query(queriesUsers.validateUser);

    const user = result.recordset[0]; 

    if (user && (user.Type === 'S')) {
      const token = jwt.sign({ username: user.username, type: user.Type }, config.secretKey, {
        expiresIn: "1h", // Tiempo de expiración del token (1 hora)
      });
      res.json({token, message: "Inicio de sesión exitoso" });
    } else {
      res.status(401).json({ error: "Credenciales inválidas" });
    }

  } catch (error) {
    console.error("Error al validar el usuario:", error);
    res.status(500).json({ error: "Error al validar el usuario" });
  }
};


//Mostrar los puestos o grupos
export const showResourceGroups = async (req, res) => { 
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesResourceGroups.getResourceGroups);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los puestos:", error);
    res.status(500).json({ error: "Error al obtener los puestos" });
  }
};

//Mostrar usuarios en un mismo puesto de trabajo o grupo de recursos
export const showUsersResourceGroups = async (req,res) => {
  try {
    const { Role } = req.query;

    const pool = await getConnection();
    const result = await pool.request()
    .input("Role", Role)
    .query(queriesResourceGroups.selectPuestos);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los grupos de recursos:", error);
    res.status(500).json({ error: "Error al obtener los grupos de recursos" });
  }
}

//Mostrar centros de costo
export const showCecos = async (req,res) => { 
      try {
        const pool = await getConnection();
        const result = await pool
        .request()
        .query(queriesCecos.getCecos);

        res.json(result.recordset);

      } catch (error) {
        console.error("Error al obtener los centros de costo:", error);
        res.status(500).json({ error: "Error al obtener los centros de costo" });
      }
}

//Mostrar usuarios en un mismo Centro de Costo
export const showUsersFromCecos = async (req,res) => {
  try {
    const { Ceco } = req.query;

    console.log(Ceco);

    const pool = await getConnection();
    const result = await pool.request()
    .input("Ceco", Ceco)
    .query(queriesCecos.selectCecos);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los centros de costo:", error);
    res.status(500).json({ error: "Error al obtener los centros de costo" });
  } 
}

//Importar tabla de usuarios
export const importUsersTable = async (req,res) => {
  try {
    const {excelFilePath} = req.body

    const importUsersQuery = `
    ALTER TABLE Tiempos NOCHECK CONSTRAINT FK__Tiempos__UserCod__31EC6D26;
    DELETE FROM Usuarios -- Agrega la condición para especificar qué registros deseas eliminar
    ALTER TABLE Tiempos CHECK CONSTRAINT FK__Tiempos__UserCod__31EC6D26;

    INSERT INTO Usuarios (Code, Name, Username, Password, Ceco, Role, Type)   
    SELECT Code, Name, Username, Password, Ceco, Role, Type FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=${excelFilePath}.xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Username, Password, Ceco, Role, Type FROM [Usuarios$]');
  `;
 
    const pool = await getConnection();
    const response = await pool.request().query(importUsersQuery)

    res.json(response);
    
  } catch (error) {
    console.error('Error al importar la tabla:', error);
    res.status(500).send('Error al importar la tabla, revisa que las tablas "Puestos" y/o "Cecos" existan o esten importadas');
  } 
}  

//importar tabla de centros de costo
export const importCecosTable = async (req,res) => {
  try {
    const {excelFilePath} = req.body;

    const importCecosQuery = `
    DELETE FROM Cecos
    INSERT INTO Cecos (Code, Name, Parent)
    SELECT Code, Name, Parent FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=${excelFilePath}.xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Parent FROM [Centros de Costo$]')
    `

    const pool = await getConnection();
    const response = await pool.request().query(importCecosQuery)

    res.json(response);
  } catch (error) {
    console.error('Error al importar la tabla:', error);
    res.status(500).send('Error al importar la tabla');
  }
}  

//Importar tabla de puestos
export const importRescourceGroupsTable = async (req,res) => {
  try {
    const {excelFilePath} = req.body;

    const importRescourceGroupsQuery = `	
    DELETE FROM Puestos
    INSERT INTO Puestos (Code, Name) 
    SELECT Code, Name FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=${excelFilePath}.xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name FROM [Puestos$]')
    `

    const pool = await getConnection();
    const response = await pool.request().query(importRescourceGroupsQuery);

    res.json(response);
  } catch (error) {
    console.error('Error al importar la tabla:', error);
    res.status(500).send('Error al importar la tabla');
  }
}  

//Importar tabla de procesos
export const importActivitiesTable = async (req,res) => {
  try {
    const {excelFilePath} = req.body;

    const importActivitiesQuery = `  
    DELETE FROM Procesos  
    INSERT INTO Procesos (Code, Name, Type, Label, Tip, Role, Description) 
    SELECT Code, Name, Type, Label, Tip, Role, Description FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=${excelFilePath}.xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Type, Label, Tip, Role, Description FROM [Procesos$]')
    `

    const pool = await getConnection();
    const response = await pool.request().query(importActivitiesQuery);

    res.json(response);
  } catch (error) {
    console.log("Error al importar la tabla:", error.response.data.error);
    console.error('Error al importar la tabla:', error);
    res.status(500).send('Error al importar la tabla');
  }
}

//Envio de datos para crear una encuesta nueva
export const createEncuesta = async (req, res) => {
  try {
    const { Code, Number, Description } = req.body;

    const pool = await getConnection();
    await pool
      .request()
      .input("Code", Code)
      .input("Number", Number)
      .input("Description", Description)
      .query(queriesSurveys.creteNewSurvey);

    res.sendStatus(200); // Inserción exitosa

  } catch (error) {
    console.error("Error al crear la encuesta:", error);
    res.status(500).json({ error: "Error al crear la encuesta" });
  }
};

//Activar una encuesta
export const activateSurvey = async (req,res) => {
  try {
    const { Code } = req.body;

    const pool = await getConnection();

    await pool.request()   
    .input("Code",Code)
    .query(queriesSurveys.activateSurvey);  
    
    console.log(Code );

  } catch (error) {
    console.error("Error al activar la encuesta:", error);
    res.status(500).json({ error: "Error al activar la encuesta" });
  }
}

//Desactivar una encuesa
export const deactivateSurvey = async (req,res) => {
  try {

    const { Code } = req.body;

    const pool = await getConnection();

    await pool.request()
    .input("Code", Code)
    .query(queriesSurveys.deactivateSurvey)

    console.log(Code);
    
  } catch (error) {
    console.error("Error al desactivar la encuesta:", error);
    res.status(500).json({ error: "Error al desactivar la encuesta" });
  }
}

//Mostrar las encuestas
export const showSurveys = async (req,res) => {
  try {
    const pool = await getConnection();

    const response = await pool.request().query(queriesSurveys.showAllSurveys);

    res.json(response.recordset);

  } catch (error) {
    console.error("Error al mostrar la encuesta:", error);
    res.status(500).json({ error: "Error al mostrar la encuesta" });
  }
} 

//Mostrar todas las actividades
export const showActivities = async (req,res) => {
  try {
    const pool = await getConnection();

    const response = await pool.request().query(queriesActivities.displayAllActivities);

    res.json(response.recordset);

  } catch (error) {
    console.error("Error al mostrar actividades:", error);
    res.status(500).json({ error: "Error al mostrar las actividades" });
  }
} 

//Mostrat tabla de tiempos
export const displayTimes = async (req,res) => {
  try {
    const pool = await getConnection();

    const response = await pool.request().query(queriesTimes.displayTimes);

    res.json(response.recordset);

  } catch (error) {
    console.error("Error al mostrar los tiempos:", error);
    res.status(500).json({ error: "Error al mostrar los tiempos" });
  }
} 

//Borrar una encuesta
export const deleteSurvey = async (req,res) => {
  try {
    
    const {Code} = req.body

    const pool = await getConnection();
    pool.request().
    input("Code", Code)
    .query(queriesSurveys.deleteSurveys);
 
  } catch (error) {
    console.error("Error al mostrar los tiempos:", error);
    res.status(500).json({ error: "Error al mostrar los tiempos" });
  }
}