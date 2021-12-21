const express = require('express')
const {check,login} = require('../../controllers/admins')
const {adminAuth} = require('../../middleware/authentication')

const router = new express.Router()

router.get('/check',adminAuth,check)

router.post('/login',login)

module.exports = router



