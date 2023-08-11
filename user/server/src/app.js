import express from 'express';
import router from './routes/routes';
import cors from 'cors';

const app = express();

// seccion para configurar el puerto
app.set('port', 4000);

// middlewares
// Hacemos esto porque el servidor no esta configurado para aceptar datos JSON
app.use(express.json());

// Tambien recibir datos desde formularios HTML
app.use(express.urlencoded({ extended: false }));

// Configurar CORS
app.use(cors());

// Rutas
app.use(router);

export default app;
