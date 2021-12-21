const express = require('express');
const { addNewBook, getBooks, editBook, getBook, deleteBook } = require('../../controllers/books')
const { adminAuth } = require('../../middleware/authentication')


const router = new express.Router()

router.post('', adminAuth, addNewBook)

router.patch('/:bookID', adminAuth, editBook)

router.get('', getBooks)

router.get('/:bookID', getBook)

router.delete('/:bookID', adminAuth, deleteBook)

module.exports = router