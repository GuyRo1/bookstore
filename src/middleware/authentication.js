const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')
const User = require('../models/user')


const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!admin) {
            throw new Error()
        }
        next()
    } catch (e) {
        next({ status: 401, message: "No authorization" })
    }
}

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        next({ status: 401, message: "No authorization" })
    }

}


module.exports = { userAuth, adminAuth }