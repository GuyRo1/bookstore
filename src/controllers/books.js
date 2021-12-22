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

async function getBooks(req, res, next) {
    try {
        let books, limit, skip
        const match = {}
        if (req.query.nameContains) {
            match.name = { $regex: new RegExp(req.query.nameContains,"i") }
            console.log(match.name);
           
        }


        if (req.query.limit && req.query.skip) {
            limit = parseInt(req.query.limit)
            skip = parseInt(req.query.skip)
        }


        if (limit !== NaN && skip !== NaN)
            books = await Book.find(match).limit(limit).skip(skip)
        else
            books = await Book.find(match)


        res.send(books)
    } catch (err) {
        next(err)
    }
}

async function getBook(req, res, next) {
    try {
        const book = await Book.findOne({ _id: req.params.bookID })
        res.send(book)
    } catch (err) {
        next(err)
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

