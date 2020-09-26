//run npm install nodemon --save-dev
const express = require('express'); //npm install express --save
const mongoose = require('mongoose');   //npm install mongoose
const Device = require('./models/carpark');
const bodyParser = require('body-parser'); //npm install body-parser --save
const app = express();
const bodyParser = require('body-parser');

// mongoose.connect('mongodb+srv://rashmika:rashmika@sit209.ys645.mongodb.net', {useNewUrlParser:true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;

const carpark = require('./models/carpark');
const slot = require('./models/slot');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public')); 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
    next();
});

app.use(express.json())

app.get('/api/carpark/:carParkNo',(req, res) => {
    const {carParkNo} = req.body;  

    Slot.find({ "slots":carParkNo }, (err, slots) => {
        return err      
        ? res.send(err)      
        : res.send(slots)  
    });

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

