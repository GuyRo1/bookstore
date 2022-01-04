const express = require('express')
const { getCart,clearCart, check, login, registration, addBookToCart } = require('../../controllers/users')
const { userAuth } = require('../../middleware/authentication')


const router = new express.Router()

router.get('/check', userAuth, check)

router.post('/cart', userAuth, addBookToCart)

router.post('/clear-cart',userAuth, clearCart)

router.get('/cart', userAuth, getCart)

router.post('/login', login)

router.post('', registration)

module.exports = router



