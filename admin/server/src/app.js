import config from "./config";
import express from "express";
import router from './routes/routes';
import cors from "cors";

const app = express();

// Configuración del puerto
app.set('port', config.port);

//middlewares
//Hacemos esto porque el servidor no esta configurado para aceptar datos JSON
app.use(express.json());

//Tambien recibir datos desde formularios HTML
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//
app.use(router);

export default app;
