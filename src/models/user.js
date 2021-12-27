const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
//const Book = require('./book')




const Schema = mongoose.Schema

const userNameRegex = /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{1,15}$/

const UserSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!userNameRegex.test(value))
                throw new Error('Invalid User userName')
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
    cart: [
        {
            book: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Book',
            },
            amount: {
                type: Number,
                required: true,
            },
        },
    ],
},
    {
        timestamps: true
    })

UserSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


UserSchema.methods.generateAuthToken = async function () {
    try {
        const user = this
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
        user.tokens = user.tokens.concat({ token })
        await user.save()

        return token
    } catch (err) {
        throw err
    }
}

UserSchema.statics.login = async function (userName, password) {
    try {
        const user = await User.findOne({ "username": userName })
        if (!user) throw { status: 400, message: "unable to log in" }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw { status: 400, message: "unable to log in" }
        const token = await user.generateAuthToken()
        return token
    } catch (err) {
        return null
    }
}

const User = mongoose.model('User', UserSchema)

module.exports = User