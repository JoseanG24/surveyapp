import sql from 'mssql'
import config from '../config';

const dbConfig = {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    server: 'localhost',
    database: 'biconsurveydb',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

//funcion asincrona para conectarse
//o sea que puede tomar tiempo para conectarse

export async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.log(error);
    }
};

