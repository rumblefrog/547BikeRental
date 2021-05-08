import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database';
import NoResult from '../errors/NoResult';
import Rental from './Rental';

export default class User {
    /**
     * User ID
     * 
     * Auto incremental PK.
     * 
     * Empty for insertions.
     */
    public id: number | null;

    /**
     * Username
     */
    public username!: string;

    /**
     * Email
     */
    public email: string | null;

    /**
     * Password (hashed)
     */
    public readonly password!: string;

    /**
     * Timestamp in which the user is created at
     */
    public created_at: number | null;

    constructor(username: string, password: string) {
        this.id = null;
        this.username = username;
        this.email = null;
        this.password = password;
        this.created_at = null;
    }

    /**
     * Insert user into database
     * 
     * @async
     */
    async insert() {
        let [ results ] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)',
            [this.username!, this.email!, this.password!],
        );

        this.id = results.insertId;
    }

    /**
     * Fetch an user by its username
     * 
     * @param username User name
     */
    static async searchByUsername(username: string): Promise<User> {
        let [ rows, fields ] = await pool.query<RowDataPacket[]>(
            'SELECT `id`, `username`, `email`, `password`, `created_at` FROM users WHERE `username` = ?',
            [username],
        );

        if (rows.length == 0)
            throw new NoResult();

        let [ r ] = rows;

        let user = new User(r.username, r.password);

        user.id = r.id;
        user.email = r.email;
        user.created_at = r.created_at;

        return user;
    }

    /**
     * Fetch active rental for an user if any
     * 
     * @param user_id User ID
     */
    static async activeRentals(user_id: number): Promise<Rental | null> {
        let [ rows, fields ] = await pool.query<RowDataPacket[]>(
            `
                SELECT
                    id,
                    user_id,
                    bike_id,
                    duration,
                    UNIX_TIMESTAMP(rental_start) as rental_start,
                    UNIX_TIMESTAMP(rental_end) as rental_end
                FROM
                    rentals
                WHERE
                    user_id = ?
            `,
            [ user_id ],
        );

        if (rows.length == 0)
            return null;

        let [ r ] = rows;

        return new Rental(r.id, r.user_id, r.bike_id, r.duration, r.rental_start, r.rental_end);
    }
}