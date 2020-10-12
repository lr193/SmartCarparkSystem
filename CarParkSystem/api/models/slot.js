const mongoose = require('mongoose');

module.exports = mongoose.model('slot', new mongoose.Schema({
    number: Number,
    carparkNumber: Number,
    status: Boolean,
    level: Number
}));