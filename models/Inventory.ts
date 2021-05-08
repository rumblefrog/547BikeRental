import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../database';

export default class Inventory {
    /**
     * Bike inventory ID
     * 
     * Hardware persisted ID.
     */
    public readonly id: number;

    /**
     * Bike hardware public key.
     */
    public readonly public_key: string;

    /**
     * Cost to rent the bike on hourly basis.
     */
    public readonly cost: number;

    /**
     * If bike is missing
     * 
     * TODO: Get/setter => query
     */
    public readonly missing: boolean;

    /**
     * Description of the bike
     */
    public readonly description: string;

    /**
     * Time this bike was inserted into inventory
     */
    public readonly created_at: number;

    constructor
    (
        id: number,
        public_key: string,
        cost: number,
        missing: boolean,
        description: string,
        created_at: number,
    ) {
        this.id = id;
        this.public_key = public_key;
        this.cost = cost;
        this.missing = missing;
        this.description = description;
        this.created_at = created_at;
    }

    /**
     * Register a new bike into inventory
     */
    static async register_bike(bike_id: number, public_key: string, cost: number, description: string) {
        await pool.execute<ResultSetHeader>(
            `
                INSERT INTO inventory
                (id, public_key, cost, missing, description)
                VALUES
                (?, ?, ?, 0, ?)
            `,
            [ bike_id, public_key, cost, description ],
        );
    }

    /**
     * Foreign references rentals for available bikes.
     */
    static async availableInventory(): Promise<Inventory[]> {
        let [ rows, fields ] = await pool.query<RowDataPacket[]>(
            `
                SELECT
                    inv.id,
                    inv.public_key,
                    inv.cost,
                    inv.missing,
                    inv.description,
                    inv.created_at
                FROM inventory inv
                    LEFT JOIN rentals r
                    ON inv.id = r.bike_id AND r.rental_end IS NOT NULL
            `
        );

        return rows.map(r => new Inventory(r.id, r.public_key, r.cost, r.missing, r.description, r.created_at));
    }
}