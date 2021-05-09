import { createPool } from 'mysql2';

export const pool = createPool({
    host: 'db',
    user: 'root',
    database: 'bike_rental',
    password: 'fishy',
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
}).promise();
