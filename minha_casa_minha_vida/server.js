const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const flag = process.env.FLAG || 'hawk{f4k3_fl4g}';

app.set('view engine', 'ejs');
app.set('views', './views');

app.set('public', __dirname + '/public');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/flag', (req, res) => {
    const { password } = req.query;
    if (password === '#4F8{a1U3H@h') {
        res.json({ flag });
    } else {
        res.status(403).json({ error: 'Invalid password' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});