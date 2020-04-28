const http = require('http')
const express = require('express')
const app = require('./app')
const cors = require('cors')
const mongoose = require('mongoose')

console.log('connecting to mongodb')
const mongoUrl = 'mongodb+srv://madibentl:rawDen1m@cluster0-wh8e2.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.json())



const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
