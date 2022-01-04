const req = require('express/lib/request')
const User = require('../models/user')



async function check(req, res) {
    res.send({ status: 200, user: req.user })
}

async function login(req, res, next) {
    try {
        if (!req.body.userName || !req.body.password) throw new Error('')
        const token = await User.login(req.body.userName, req.body.password)

        if (!token) throw { status: 400, message: "could not log in" }
        res.send({ status: 200, token })
    } catch (err) {
        next({ status: 400, message: "could not log in" })
    }

}

async function registration(req, res, next) {
    try {
        const user = new User()
        user.username = req.body.userName
        user.password = req.body.password
        await user.save()
        res.status(201).send({ status: 201, user: user })
    } catch (err) {
        console.log(err);
        next(err)
    }
}

async function addBookToCart(req, res, next) {
    try {
        const cart = req.user.cart
        const newBookID = req.body.id
        const newBookAmount = req.body.amount
        if (cart.length === 0) {
            cart.push({ book: newBookID, amount: newBookAmount })
        } else {
            let foundBook = false
            for (let index = 0; index < cart.length && !foundBook; index++) {
                let currentBook = cart[index]
                if (newBookID === currentBook.book.toString()) {
                    currentBook.amount += newBookAmount
                    foundBook = true
                }
            }
            if (!foundBook)
                cart.push({ book: newBookID, amount: newBookAmount })
        }

        const filter = { _id: req.user._id }
        const update = req.user
        const user = await User.findOneAndUpdate(filter, update, { new: true })
        res.send({ status: 200, user })
    } catch (err) {
        next(err)
    }



}

async function clearCart(req, res, next) {
    try {
        req.user.cart = [] 
        const filter = { _id: req.user._id }
        const update = req.user
        const user = await User.findOneAndUpdate(filter, update, { new: true })
        res.send({ status: 200, user })
    } catch (err) {
        next(err)
    }



}

async function getCart(req, res, next) {
    try {

        await req.user.populate('cart.book')

        res.send({ "status": 200, cart: req.user.cart })
    } catch (err) {
        next({ status: 500, message: "server error" })
    }

}

module.exports = { clearCart, getCart, addBookToCart, check, login, registration }