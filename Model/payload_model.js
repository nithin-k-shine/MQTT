const mongoose = require('mongoose');
const validator = require('validator');

const payload_schema = new mongoose.Schema({
    name:{
        type: 'string',
        required: [true, 'A user must have a name'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters'],
        validate: [validator.isAlpha, 'Name must only contain characters']
    },
    age:{
        type: 'number',
        required: [true, 'A user must have a age'],
        unique: false
    },
    surname:{
        type: 'string',
        required: [true, 'A user must have a surname'],
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters'],
        validate: [validator.isAlpha, 'Name must only contain characters']
    }
});

const payload = mongoose.model('payload',payload_schema)
module.exports = payload;