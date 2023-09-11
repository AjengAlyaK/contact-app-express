const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const {loadContact, findContact, addContact, cekDuplikat} = require('./utils/contacts')
const {body, validationResult, check} = require('express-validator')

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
// data yang di request dari form  harus di parsing dulu ya
app.use(express.urlencoded({extended: true})) // built in middleware

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

// halaman form tambah data kontak
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
    })
})

// proses data contact
app.post('/contact', [
    body('nama').custom((value)=>{
        const duplikat = cekDuplikat(value);
        if(duplikat){
            throw new Error('Nama contact sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No HP tidak valid!').isMobilePhone('id-ID')
], (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({errors: errors.array()});
        res.render('add-contact', {
            title: 'Form Tambah Data Contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    };
    // addContact(req.body);
    // res.redirect('/contact');
})

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


