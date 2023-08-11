import { showUsers, loginUser, showResourceGroups, showCecos, showUsersFromCecos, showUsersResourceGroups, importUsersTable, importCecosTable, importRescourceGroupsTable, importActivitiesTable, createEncuesta, activateSurvey, showSurveys, deactivateSurvey, showActivities, displayTimes, deleteSurvey } from '../controllers/controllers';
import { Router } from 'express';

const router = Router();

//Mostrar usuarios y contraseñas
router.get('/login', showUsers);

//validar el usuario
router.post('/login', loginUser);

//mostrar puestos
router.get('/puestos', showResourceGroups);

//mostrar CECOS
router.get('/cecos', showCecos);

//mostrar usuarios en un mismo centro de costo
router.get('/users_cecos', showUsersFromCecos);

//mostrar usuarios en un mismo grupo de recursos o puesto de trabajo
router.get('/users_rg', showUsersResourceGroups);   

//Importar tabla de usuarios
router.post('/import-users', importUsersTable);

//Importar tabla de centros de costo
router.post('/import-cecos', importCecosTable);

//Importar tablas de puestos o grupos de recursos
router.post('/import-rg', importRescourceGroupsTable);

//Importar tabla de actividades 
router.post('/import-activities', importActivitiesTable);  

//Crear una nueva encuesta
router.post('/encuestas', createEncuesta);

//Mostrar encuestas
router.get('/encuestas', showSurveys);

//Activar una encuesta
router.post('/activar' , activateSurvey);

//desactivar una encuesta
router.post('/desactivar', deactivateSurvey)

//mostrar actividades
router.get('/actividades', showActivities);

//mostar tiempos /reportes 
router.get('/reportes', displayTimes);

//borrar una encuesta
router.post('/delete-survey', deleteSurvey);


export default router;