const express = require('express')

const router = new express.Router()

router.get('', (req, res) => {
    res.render('admin')
})

// router.get('account', (req, res) => {
//     res.render('adminAccount')
// })

module.exports = router