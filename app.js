const config = require('./utils/config.js')
const express = require('express')
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

const mongoUrl = config.MONGODB_URI
console.log(`connecting to mongodb ${mongoUrl}`)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = app
