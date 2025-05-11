const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const flag = process.env.FLAG || 'hawk{f4k3_fl4g}';

app.set('view engine', 'ejs');
app.set('views', './views');

app.set('public', __dirname + '/public');
app.use(express.static('public'));

app.get('/', (req, res) => {
    if (req.method !== 'GET') {
        return res.render('index', {
            success: false,
            message: 'Método inválido. Você não vai conseguir ultrapassar o firewall assim.',
        });
    }

    if (req.get('User-Agent') !== 'DedSecBrowser') {
        return res.render('index', {
            success: false,
            message: 'Somente agentes que utilizam o navegador próprio DedSecBrowser são permitidos.'
        });
    }

    if (!req.get('Referer')?.includes('dedsec.network')) {
        return res.render('index', {
            success: false,
            message: 'Eu não confio em pessoas que não vieram pelo dedsec.network.'
        });
    }

    if (req.get('DNT') !== '1') {
        return res.render('index', {
            success: false,
            message: 'Você pode estar sendo rastreado. Quem pode estar sendo rastreado não é bem-vindo aqui.'
        });
    }

    if (!['localhost', '127.0.0.1'].includes(req.get('X-Forwarded-For')?.split(',')[0])) {
        return res.render('index', {
            success: false,
            message: 'Apenas agentes conectados na rede local podem acessar o site. Você não é um deles.'
        });
    }

    if (req.get('Secret-Code') !== 'AidenPearce') {
        return res.render('index', {
            success: false,
            message: 'Você precisa fornecer o código secreto correto para acessar o site. Somente os verdadeiros agentes DedSec têm acesso a esse código.',
            code: true
        });
    }

    res.set({ 'Flag': flag });
    res.render('index', {
        success: true,
        message: 'Você conseguiu ultrapassar o firewall e demonstrou que é um agente DedSec verídico. Sua flag foi entregue.',
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
