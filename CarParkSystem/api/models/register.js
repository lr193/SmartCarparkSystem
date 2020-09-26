const mongoose = require('mongoose');
module.exports = mongoose.model('Register', new mongoose.Schema({
    user: String,
    vehicle_rego: String,
    vehicle_model: String,
    password: String    
}));