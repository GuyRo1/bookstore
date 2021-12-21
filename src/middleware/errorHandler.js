const express = require('express')

function errorHandler(err, req, res, next) {
    const status = err.status || 500
    res.status(status).send(err)
}

module.exports = errorHandler