import { createPool } from 'mysql2';

export const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'bike_rental',
    password: 'fishy',
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
}).promise();
