const Admin = require('../models/admin')
//const express = require('express')

async function check(req, res) {
    res.send({ status: 200, message: "admin status is approved" })
}

async function login(req, res,next) {
    try {
        if (!req.body.userName||!req.body.password) throw new Error('')
        
        const token = await Admin.login(req.body.userName, req.body.password)
    
        if (!token) throw new Error('')
        res.send({ status: 200, token})
    } catch (err) {
        next({status:400,message:"could not log in"})
    }

}

module.exports = {check,login}