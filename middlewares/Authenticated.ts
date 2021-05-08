import { Request, Response, NextFunction } from 'express'; 

import '../interfaces/ISession';

export default function authenticated(req: Request, res: Response, next: NextFunction) {    
    if (req.session.user != undefined)
        next();
    else
        res.redirect('/login');
}
