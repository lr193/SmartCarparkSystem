const mongoose = require('mongoose');

module.exports = mongoose.model('carpark', new mongoose.Schema({
    id: Number,
    lat: Number,
    lng: Number,
    slots: Number,
    levels: Number
}));