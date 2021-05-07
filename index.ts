import express from 'express';
import mustacheExpress from 'mustache-express';

const app = express();

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('view cache', false);
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index', { title: 'you are retarded', message: 'autism'} );
});

app.listen(3000, () => console.log('Server running @ 3000'));
