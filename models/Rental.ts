import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database';

export default class Rental {
    /**
     * Rental ID
     * 
     * Auto incremental PK
     */
    public readonly id: number;

    /**
     * User that rented/renting this bike.
     */
    public readonly user_id: number;

    /**
     * Bike that is being rented.
     */
    public readonly bike_id: number;

    /**
     * Duration of rental in seconds.
     */
    public readonly duration: number;

    /**
     * Time the rental started/created.
     * 
     * Unix epoch
     */
    public readonly rental_start: number;

    /**
     * Time this bike was returned.
     * 
     * Unix epoch
     * 
     * Null if never returned.
     */
    public readonly rental_end: number | null;

    constructor
    (
        id: number,
        user_id: number,
        bike_id: number,
        duration: number,
        rental_start: number,
        rental_end: number,
    ) {
        this.id = id;
        this.user_id = user_id;
        this.bike_id = bike_id;
        this.duration = duration;
        this.rental_start = rental_start;
        this.rental_end = rental_end;
    }

    static async startRental(user_id: number, bike_id: number, duration: number) {
        await pool.execute<ResultSetHeader>(
            `
                INSERT INTO rentals
                (user_id, bike_id, duration, rental_start)
                VALUES
                (?, ?, ?, CURRENT_TIMESTAMP)
            `,
            [ user_id, bike_id, duration ]
        );
    }

    /**
     * Used by hardware scanner to return authenticated bikes.
     * 
     * @param bike_id Bike inventory ID
     */
    static async endRental(bike_id: number) {
        await pool.execute(
            `
                UPDATE rentals
                SET
                    rental_end = CURRENT_TIMESTAMP
                WHERE
                    bike_id = ? AND rental_end IS NULL
            `,
            [ bike_id ],
        );
    }
}