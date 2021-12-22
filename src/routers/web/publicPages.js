const express = require('express')

const router = new express.Router()

router.get('',(req,res)=>{
    res.render('index')
})

router.get('/book/:bookID',(req,res)=>{
    res.render('page')
})

router.get('/cart',(req,res)=>{
    res.render('shoppingCart')
})
module.exports = router