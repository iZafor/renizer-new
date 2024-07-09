import mysql from "serverless-mysql";

export const db = mysql({
    config: {
        host: process.env.REnizer_DB_HOST,
        user: "root",
        password: process.env.REnizer_DB_USER_PASSWORD,
        port: Number(process.env.REnizer_DB_PORT),
        database: "REnizer_new",
        multipleStatements: true,
    },
    backoff: "decorrelated",
    zombieMaxTimeout: 20,
});

export type DType = number & string & Date & null & undefined & unknown;

export interface QueryResult {
    [key: string]: DType;
}

export function parseToPlainObject(rows: QueryResult[]) {
    return rows.map((row) => Object.assign({}, row));
}
