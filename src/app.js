const express = require('express')
require('./db/mongoose')
const path = require('path')
const cors = require('cors')
const hbs = require('hbs')
const bookRouter = require('./routers/api/books')
const adminRouter = require('./routers/api/admins')
const adminPage = require('./routers/public/adminPage')
const errorHandler = require('./middleware/errorHandler')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(cors())
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use('/books', bookRouter)
app.use('/admins',adminRouter)
app.use('/admin',adminPage)
app.use(errorHandler)

module.exports = app