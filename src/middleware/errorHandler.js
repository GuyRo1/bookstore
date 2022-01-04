function errorHandler(err, req, res, next) {
    const status = err.status || 500
    res.status(status).send({ status, message: err })
}

module.exports = errorHandler