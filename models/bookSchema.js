let mongoose = require('mongoose');

let bookSchema = mongoose.Schema({
    // _id: {
    //     type: Number,
    //     required: true,
    // },
    author: {
        type: String,
        required:true,
    },
    country: {
        type: String,
        required:true,
    },
    imageLink: {
        type: String,
        required:true,
    },
    language: {
        type: String,
        required:true,
    },
    link: {
        type: String,
        required:true,
    },
    pages: {
        type: Number,
        required:true,
    },
    title: {
        type: String,
        required:true,
    },
    year: {
        type: Number,
        required:true,
    }
})

let result = module.exports = mongoose.model('books', bookSchema);