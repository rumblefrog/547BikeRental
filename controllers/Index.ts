import { Request, Response } from 'express';

import '../interfaces/ISession';

// These methods are static/stateless renders
export default class Index {
    public static home(req: Request, res: Response) {
        return res.render('index');
    }

    public static login(req: Request, res: Response) {
        if (req.session.user != undefined)
            return res.redirect('/user');

        return res.render('login', {
            hasError: req.query.hasOwnProperty('error'),
            error: req.query.error
        });
    }

    public static register(req: Request, res: Response) {
        if (req.session.user != undefined)
            return res.redirect('/user');

        return res.render('register', {
            hasError: req.query.hasOwnProperty('error'),
            error: req.query.error
        });
    }
}
