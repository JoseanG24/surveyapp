//Rutas que se usaran en otros archivos
 import { Router } from "express";
 import { displayActivities, saveTime , loginUser, getUsers, displayUserInformation, getUserRole, displaAllActivities, getUserCode, getSurveyCode, checkSurvey} from "../controllers/controllers";

 const router = Router()

 //obtener los datos de las actividades
 router.get("/activities", displayActivities);

//todas las actividades
router.get("/all-activities", displaAllActivities)

 //guardar timestamps
 router.post("/times", saveTime);

//Obtener el grupo de recursos del usuario correspondiente
router.get('/user-role', getUserRole);

// Mostrar usuarios
router.get("/login", getUsers);

// Log in con usuario y contraseña
router.post("/login", loginUser);

//Mostrar datos del usuario
router.get('/users', displayUserInformation);

//Obtener el codigo del usuario para enviar en el timestamp
router.get('/user-code', getUserCode)

//Obtener el codigo de la encuesta para enviar en el timestamp
router.get('/survey-code', getSurveyCode);

//Obtener el valor Active de las encuestas
router.get('/active-survey', checkSurvey);

 export default router;

