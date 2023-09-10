const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {loadContact, findContact} = require('./utils/contacts')

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
    // res.sendFile('./index.html',  {root: __dirname})
    const mahasiswa = [
        {
            nama: 'Itadori Yuji',
            email: 'yuji@gmail.com'
        },
        {
            nama: 'Megumi Fushiguro',
            email: 'fushiguro@gmail.com'
        },
        {
            nama: 'Kugisaki Nobara',
            email: 'nobara@gmail.com'
        }
    ];

    res.render('index', {
        nama : 'I am the problem its me',
        title: 'Halaman Home',
        mahasiswa,
        layout: 'layouts/main-layout',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'Halaman About',
    });
});

app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact',
        contacts,
    });
});

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Halaman Detail Contact',
        contact,
    });
});

app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
