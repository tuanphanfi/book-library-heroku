let mongoose = require('mongoose');

//article schema
let usersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        
    },
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
    confirmPassword: {
        type: String,
        require: true,
    },
    

});

let users = module.exports = mongoose.model('Users', usersSchema);