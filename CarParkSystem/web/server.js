const express = require('express');
const app = express();

app.get('/', function (req, res) {  res.sendFile(`${base}/index.html`);});
const port = 3000;
const base = `${__dirname}/car`;
app.listen(port, () => {console.log(`listening on port ${port}`);});

app.use(express.static('car'));

app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});

app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});

app.get('/carparkinfo', (req,res) =>{
    res.sendFile(`${base}/carParkInfo.html`)
})

app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
