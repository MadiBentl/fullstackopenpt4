const config = require('./utils/config.js')
const express = require('express')
require('express-async-errors')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const middleware = require('./utils/middleware')
const bodyParser = require('body-parser')


const mongoUrl = config.MONGODB_URI
console.log(`connecting to mongodb ${mongoUrl}`)

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use(bodyParser.json({ type: '*/*' }))
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  console.log('testing from app')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
