const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');
const { promisify } = require('util');

const PORT = process.env.PORT || 8000;
const DB_PATH = process.env.DB_PATH || 'shopping.db';
const BLOCKLIST = ['Flag do Desafio'];

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('public', __dirname + '/public');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database:', DB_PATH);
});

const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

const handleDbError = (res, err, message) => {
    console.error(message, err);
    db.close((closeErr) => {
        if (closeErr) console.error('Error closing database:', closeErr);
    });
    return res.render('index', { items: [], error: message });
};

app.get('/', async (req, res) => {
    try {
        const items = await dbAll('SELECT name, image FROM items');
        res.render('index', { items, error: null });
    } catch (err) {
        console.error('Error fetching items:', err);
        res.render('index', { items: [], error: 'Erro ao carregar itens.' });
    }
});

app.get('/review', async (req, res) => {
    const item = req.query.item?.toString().trim();

    if (!item) {
        const items = await dbAll('SELECT name, image FROM items');
        return res.render('index', { items, error: 'Nenhum item fornecido.' });
    }

    if (BLOCKLIST.includes(item)) {
        const items = await dbAll('SELECT name, image FROM items');
        return res.render('index', { items, error: 'Termo proibido!' });
    }

    try {
        const row = await dbGet('SELECT * FROM items WHERE id = ?', [md5(item).slice(0, 6)]);

        if (!row) {
            const items = await dbAll('SELECT name, image FROM items');
            return res.render('index', { items, error: 'Item não encontrado!' });
        }

        res.render('review', {
            name: row.name,
            price: row.price,
            description: row.description,
            image: row.image,
        });
    } catch (err) {
        return handleDbError(res, err, 'Erro ao consultar o banco de dados.');
    }
});

// Gracefully handle shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down...');
    db.close((err) => {
        if (err) console.error('Error closing database:', err);
        process.exit(0);
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});