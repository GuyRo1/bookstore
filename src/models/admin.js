const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const Schema = mongoose.Schema

const userNameRegex = /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{1,15}$/

const AdminSchema = Schema({
    username: {
        type: String,
        required: true,
        validate(value) {
            if (!userNameRegex.test(value))
                throw new Error('Invalid Admin userName')
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},
    {
        timestamps: true
    })

AdminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)

    }

    next()
})


AdminSchema.methods.generateAuthToken = async function () {
    try {
        const admin = this
        const token = jwt.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET)

        admin.tokens = admin.tokens.concat({ token })
        await admin.save()

        return token
    } catch (err) {
        console.log(err);
    }
}

AdminSchema.statics.login = async function (userName, password) {
    try {
        const admin = await Admin.findOne({ userName })
        if (!admin) throw { status: 400, message: "unable to log in" }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) throw { status: 400, message: "unable to log in" }
        const token = await admin.generateAuthToken()
        return token
    } catch (err) {
        return null
    }
}

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin