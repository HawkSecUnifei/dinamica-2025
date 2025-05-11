const sqlite3 = require('sqlite3').verbose();
const md5 = require('md5');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'shopping.db');

const FLAG = process.env.FLAG || 'hawk{th4l3s_j0g0u_0_sh0rt_f0r4}';

const items = [
    {
        name: 'Adesivo',
        price: 19.90,
        description: 'Adesivo oficial da HawkSec, perfeito para personalizar seu laptop ou estação de batalha. Com o logotipo do time, este item é um símbolo de orgulho para quem domina os CTFs e vive a cultura hacker.',
        image: 'img/adesivo.png'
    },
    {
        name: 'Moletom',
        price: 249.90,
        description: 'Moletom exclusivo da HawkSec, projetado para manter você aquecido durante longas noites de competições CTF. Com nosso escudo, é a escolha ideal para exibir sua paixão por cibersegurança com estilo.',
        image: 'img/moletom.png'
    },
    {
        name: 'Body',
        price: 129.90,
        description: 'Body temático da HawkSec, perfeito para os mais jovens fãs do time. Feito com tecido confortável, representa a próxima geração de hackers éticos prontos para dominar os desafios de cibersegurança.',
        image: 'img/body.png'
    },
    {
        name: 'Caneca',
        price: 49.90,
        description: 'Caneca oficial da HawkSec, ideal para seu café enquanto decifra flags ou analisa exploits. É um item essencial para qualquer membro ou fã do time.',
        image: 'img/caneca.png'
    },
    {
        name: 'Squeeze',
        price: 34.90,
        description: 'Squeeze portátil da HawkSec, perfeita para manter você hidratado durante maratonas de CTF. Com design ergonômico é o acessório ideal para levar o espírito hacker aonde for.',
        image: 'img/squeeze.png'
    },
    {
        name: 'Short do Thales',
        price: 420.69,
        description: 'Um lendário short usado pelo Thales, membro icônico da HawkSec. Dizem que este pedaço de pano carrega a energia caótica dos CTFs, mas cuidado: usá-lo pode fazer você parecer... bem, quase pelado!',
        image: 'img/short_do_thales.png'
    },
    {
        name: 'Flag do Desafio',
        price: 0.01,
        description: `Uma flag misteriosa que não deveria estar no banco de dados. Apenas os verdadeiros mestres da HawkSec conseguirão reivindicar sua glória no CTF.\n${FLAG}`,
        image: 'img/flag.png'
    }
];

async function createDatabase() {
    const db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Failed to connect to database:', err);
            process.exit(1);
        }
        console.log('Connected to SQLite database:', DB_PATH);
    });

    const dbRun = require('util').promisify(db.run.bind(db));
    const dbAll = require('util').promisify(db.all.bind(db));

    try {
        await dbRun(`
            CREATE TABLE IF NOT EXISTS items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                description TEXT NOT NULL,
                image TEXT NOT NULL
            )
        `);
        console.log('Created items table (if not exists).');

        const existingItems = await dbAll('SELECT id FROM items');
        const existingIds = existingItems.map(row => row.id);

        for (const item of items) {
            const id = md5(item.name).slice(0, 6);
            if (existingIds.includes(id)) {
                console.log(`Item "${item.name}" (id: ${id}) already exists, skipping.`);
                continue;
            }

            await dbRun(
                'INSERT INTO items (id, name, price, description, image) VALUES (?, ?, ?, ?, ?)',
                [id, item.name, item.price, item.description, item.image]
            );
            console.log(`Inserted item "${item.name}" with id: ${id}`);
        }

        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    } finally {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}

createDatabase().catch(err => {
    console.error('Failed to create database:', err);
    process.exit(1);
});
