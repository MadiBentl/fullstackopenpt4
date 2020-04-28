const express = require('express')
const blogsRouter = require('./controllers/blogs')

const app = express()

app.use('/api/blogs', blogsRouter)

module.exports = app
