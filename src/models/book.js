const mongoose = require('mongoose')

const urlRegex = /^(?:(?:(?<protocol>(?:http|https)):\/\/)?(?:(?<authority>(?:[A-Za-z](?:[A-Za-z\d\-]*[A-Za-z\d])?)(?:\.[A-Za-z][A-Za-z\d\-]*[A-Za-z\d])*)(?:\:(?<port>[0-9]+))?\/)(?:(?<path>[^\/][^\?\#\;]*\/))?)?(?<file>[^\?\#\/\\]*\.(?<extension>[Jj][Pp][Ee]?[Gg]|[Pp][Nn][Gg]|[Gg][Ii][Ff]))(?:\?(?<query>[^\#]*))?(?:\#(?<fragment>.*))?$/

const Schema = mongoose.Schema

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        validate(value) {
            if (value.length <= 0 && value.length > 15)
                throw new Error('Name is not valid')
        }
    },
    image: {
        type: String,
        required: true,
        validate(value) {
            if (!urlRegex.test(value))
                throw new Error('Invalid URL')
        }
    },
    author: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    numberofpages: {
        required: true,
        type: Number,
    },
    price:{
        required: true,
        type: Number,
    }
}, {
    timestamps: true
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book