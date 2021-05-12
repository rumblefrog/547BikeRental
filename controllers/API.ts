import { Request, Response } from 'express';
import { to } from 'await-to-js';

import Rental from '../models/Rental';
import Inventory from '../models/Inventory';

import { RegisterBike, ReturnBike } from '../models/API';

export default class API {
    public static async register_bike(req: Request, res: Response) {
        let payload: RegisterBike = req.body;

        let [ err, _ ] = await to(Inventory.register_bike(payload.id, payload.public_key, payload.cost, payload.description));
    
        return res.json({ success: !err });
    }

    public static async return_bike(req: Request, res: Response) {
        let payload: ReturnBike = req.body;

        let [ err, _ ] = await to(Rental.endRental(payload.id));

        return res.json({ success: !err});
        
    }
}