//Archivo para guardar variables
import {config} from "dotenv";
config();

export default {
    port: process.env.PORT || 5000,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    secretKey: process.env.SECRETTOKEN,
    DATABASE: process.env.DATABASE,
    SERVER: process.env.SERVER,
};
