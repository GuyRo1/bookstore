const Book = require('../models/book')

async function addNewBook(req, res, next) {

    try {
        const book = new Book({ ...req.body })
        await book.save()
        res.send(book)
    } catch (err) {
        console.log(err);
        next(err)
    }
}

//turn into function with query params
async function getBooks(req, res, next) {
    try {
        const books = await Book.find()
        res.send(books)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function getBook(req, res, next) {
    try {
        const books = await Book.findOne({ _id: req.id })
        res.send(books)
    } catch (err) {
        res.status(500).send(err)
    }
}

async function editBook(req, res, next) {
    try {
        const filter = { _id: req.params.bookID }
        const update = req.body
        const book = await Book.findOneAndUpdate(filter, update, { new: true })

        if (!book)
            throw { status: 400, message: 'no book with this name' }
        else
            res.send(book)
    } catch (err) {
        next(err)
    }
}

async function deleteBook(req, res, next) {
    try {
        const filter = { _id: req.params.bookID }
        const book = await Book.findOneAndDelete(filter)
        if (!book)
            throw { status: 400, message: "No book with this name" }
        else
            res.send(book)
    } catch (err) {
        next(err)
    }
}

module.exports = { addNewBook, getBooks, getBook, editBook, deleteBook }

