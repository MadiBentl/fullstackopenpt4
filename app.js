const express = require('express')
const blogsRouter = require('./controllers/blogs')
const cors = require('cors')

const app = express()

app.use(cors())
app.use('/api/blogs', blogsRouter)


module.exports = app
