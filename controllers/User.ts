import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { to } from 'await-to-js';
import moment from 'moment';

import Rental from '../models/Rental';
import Inventory from '../models/Inventory';
import UserModel from '../models/User';

import '../interfaces/ISession';

export default class User {
    public static async user(req: Request, res: Response) {
        let rental = await UserModel.activeRentals(req.session.user?.id!);

        const isRenting = (rental === null);

        return res.render('user', {
            username: req.session.user?.username,
            isRenting: (rental == null),
            duration: (!isRenting) ? moment.unix(rental!.rental_start + rental!.duration).diff(moment(), 'minutes') : null,
        });
    }

    public static async rent(req: Request, res: Response) {
        let {
            duration,
            duration_type,
        } = req.body;

        if (duration_type === 'day')
            duration *= 24;

        duration *= 60 * 60;

        let inventory = await Inventory.availableInventory();

        await Rental.startRental(req.session.user?.id!, inventory[0].id, duration);

        return res.redirect('/user');
    }

    public static async register(req: Request, res: Response) {
        const {
            email,
            username,
            password,
            confirm_password,
        } = req.body;

        if (password != confirm_password)
            return res.redirect('/register?error=Mismatch%20Password');

        let hashed_password = await hash(password, 10);

        let user = new UserModel(username, hashed_password);

        user.email = email;
        user.username = username;

        let [ err, _ ] = await to(user.insert());

        if (err)
            return res.redirect('/register?error=User%20Already%20Exists');

        return res.redirect('/login');
    }

    public static async login(req: Request, res: Response) {
        let {
            username,
            password,
        } = req.body;

        let [ err, user ] = await to(UserModel.searchByUsername(username));

        if (err)
            return res.redirect('/login?error=Invalid%20Credentials');

        if (!await compare(password, user!.password))
            return res.redirect('/login?error=Invalid%20Credentials');

        req.session.user = user;

        return res.redirect('/user');
    }

    public static logout(req: Request, res: Response) {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
}