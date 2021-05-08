import express from 'express';
import helmet from 'helmet';
import session from 'express-session';
import mustacheExpress from 'mustache-express';

import authenticated from './middlewares/Authenticated';

import Index from './controllers/Index';
import User from './controllers/User';
import API from './controllers/API';

import './database';

const app = express();

app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('view cache', false); // DEBUG ONLY
app.set('views', __dirname + '/views');

// App server will be reverse proxied by Nginx/Caddy
app.set('trust proxy', true);

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// There are numerous compatible session stores, for the demo, it's in-memory.
app.use(session({
    // Ideally this will be in an env var, but time-sake, this is fine
    secret: 'BeYi-w!wEccLCu8-U9htWHT8vMYztcYzh!-7VQJV89BrewoRh.',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Auto simplifies the diff in dev & production.
        // Care should be taken when switching env as cookie will not exist on HTTP if HTTPS is proc.
        secure: 'auto',
    },
}));

app.get('/', Index.home);

app.get('/login', Index.login);
app.post('/login', User.login);

app.get('/register', Index.register);
app.post('/register', User.register);

app.get('/user', authenticated, User.user);
app.post('/user', authenticated, User.rent);
app.get('/logout', authenticated, User.logout);

app.post('/api/register_bike', API.register_bike);
app.post('/api/return_bike', API.return_bike);

app.listen(3000, () => console.log('Server running @ 3000'));
