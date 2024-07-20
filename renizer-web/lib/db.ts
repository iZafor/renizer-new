import mysql from "serverless-mysql";

export const db = mysql({
    config: {
        host: process.env.REnizer_DB_HOST,
        user: "root",
        password: "",
        port: 3307,
        database: "renizer",
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
