//controladores
import { getConnection} from "../database/connection";
import { queriesTimes, queriesUsers, queriesActivities, queriesResourceGroups, queriesSurveys } from "../database/queries";
import jwt from 'jsonwebtoken';

//Mostrar las actividades correspondientes al usuario
export async function displayActivities(req, res) {
  try {
    const { Role } = req.query;

    console.log(req.query);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Role", Role)
      .query(queriesActivities.displayUsersActivities);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    res.status(500).json({ error: "Error al obtener las actividades" });
  }
}

//Mostrar todas las acividades
export async function displaAllActivities(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesActivities.displaAllActivities);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener activiadades:", error);
    res.status(500).json({ error: "Error al obtener actividades" });
  }
}

//Guardar timestamps 
export async function saveTime(req, res) {
    try {

      const { surveyCode, userCode, activityCode, timestamp } = req.body;

      console.log(req.body);

      const pool = await getConnection();
      const result = await pool
        .request()
        .input("Survey", surveyCode)
        .input("UserCode", userCode) 
        .input("Process", activityCode)
        .input("Timestamp", timestamp)
        .query(queriesTimes.saveTime); 

      res.json(result.recordset);

      console.log(timestamp);
      console.log(userCode);
      console.log(surveyCode);
      console.log(activityCode);

    } catch (error) {
      console.error("Error al guardar el tiempo:", error);
      res.status(500).json({ error: "Error al guardar el tiempo" });
    }
}

//Mostrar usuarios en el servidor (GET) ------------------------------
export async function getUsers(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesUsers.showUsers);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}

//Validación y autenticación de usuarios (log in)----------------------------
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body; // Obtener el nombre de usuario y contraseña del cuerpo de la solicitud

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("username", username) // Vincular el parámetro 'username' con el valor del nombre de usuario
      .input("password", password) // Vincular el parámetro 'password' con el valor de la contraseña
      .query(queriesUsers.validateUser);

    const user = result.recordset[0]; // Obtener el primer usuario del resultado de la consulta

    if (user) {
      // Usuario válido, se encontró en la base de datos
      res.json({ message: "Inicio de sesión exitoso" });
    } else {
      // Usuario inválido, no se encontró en la base de datos
      res.status(401).json({ error: "Credenciales inválidas" }); 
    }

  } catch (error) {
    console.error("Error al validar el usuario:", error);
    res.status(500).json({ error: "Error al validar el usuario" });
  }
}

//Mostrar los datos del usuario en el Home
export async function displayUserInformation(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(queriesUsers.displayUserInfo);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
}

//Obtener el rol del usuraio ingresado
export async function getUserRole(req, res) {
  try {

      const { username, password } = req.query;

      const pool = await getConnection();
      const result = await pool.request()
      .input("Username", username)
      .input("Password", password)
      .query(queriesResourceGroups.selectResourceGroup);

      res.json(result.recordset);
  } catch (error) {
      console.error('Error al obtener las tareas:', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
  }
}

//Obtener codigo del usuario basado en su rol
export async function getUserCode(req, res) {
  try {
    const { Role } = req.query;

    console.log(req.query);

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("Role", Role)
      .query(queriesUsers.getUserCode);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    res.status(500).json({ error: "Error al obtener las actividades" });
  }
}

//Obtener codigo de encuesta
export async function getSurveyCode(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(queriesSurveys.getSurveyCode);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    res.status(500).json({ error: "Error al obtener las actividades" });
  }
}

//Verificar si hay alguna encuesta activa
export async function checkSurvey(req, res) {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(queriesSurveys.checkActiveSurvey);

    console.log(result.recordset);

    res.json(result.recordset);
  } catch (error) {
    console.error("Error al obtener las actividades:", error);
    res.status(500).json({ error: "Error al obtener las actividades" });
  }
}