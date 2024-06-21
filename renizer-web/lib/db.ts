import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: process.env.REnizer_DB_HOST,
    user: "root",
    password: process.env.REnizer_DB_USER_PASSWORD,
    port: Number(process.env.REnizer_DB_PORT),
    database: "REnizer_next",
    connectionLimit: 20,
    connectTimeout: 60000,
    multipleStatements: true,
    decimalNumbers: true,
});
