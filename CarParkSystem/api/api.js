//run npm install nodemon --save-dev
const express = require('express'); //npm install express --save

const mongoose = require('mongoose');   //npm install mongoose
mongoose.connect( "mongodb+srv://hjayatilleke:hjayatilleke@cluster0.elbtc.mongodb.net/register?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

const port = 5000;
const bodyParser = require('body-parser'); //npm install body-parser --save
const app = express();

const carpark = require('./models/carpark');
const slot = require('./models/slot');
const Device = require('./models/carpark');
const Register = require('./models/register');

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

//car park
app.get('/api/carpark/:carParkNo',(req, res) => {
    const {carParkNo} = req.body;  

    Slot.find({ "slots":carParkNo }, (err, slots) => {
        return err      
        ? res.send(err)      
        : res.send(slots)  
    });

});

//registration api
app.post('/api/registration', (req, res) => {
    
    const { user, rego, model, password } = req.body;

    console.log(user+" \n"+rego+"\n"+password);

    Register.findOne({user:user}, (err, register) => {

        if(err){
            res.send(err)
            res.send('Unsuccessfull');
        }
        else{

            if(register == undefined){
                //Registration does not exist , can register 
                const newRegister = new Register({
                    "user": user,
                    "vehicle_rego": rego,
                    "vehicle_model": model,
                    "password": password
                });

                newRegister.save(err => {
                        return err
                        ? res.send(err)
                        : res.json({
                            success: true,
                            message: 'Created new user'
                        });
                });

            }
            else{
                //User already exists , cannot register
                res.send('Registration Number is already exists');
            }

        }
        
    });

});

//login api
app.post('/api/authenticate', (req, res) => { 

    const { rego, password } = req.body;

    Register.findOne({vehicle_rego:rego}, (err, register) => {

        if(err){
            res.send(err)
            res.send('Unsuccessfull');
        }
        else{

            if(register == undefined){
                res.send('user does not found');
            }else{

                if(register.password == password){
                    //Password match
                    return res.json({

                                success: true,
                                message: 'Authenticated successfully',
                            });
                }else{
                    //password do not match
                    res.send('Password is not valid');
                }
    
            }

            
        }
    });

});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

