import sql from 'mssql';
import config from '../config';

const dbConfig = {
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    server: "localhost",
    database: process.env.database,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 600000, // Tiempo de espera en milisegundos 
    },
};

export async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (error) {
        console.log(error);
    }
};
    