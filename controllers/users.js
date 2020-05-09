const bcrypt = require('bcrypt')
const User = require('../models/user')
const userRouter = require('express').Router()

userRouter.get('/', async(req, res) => {
  const users = await User.find({}).populate('blog', { title: 1 })
  res.send(users.map(user => user.toJSON()))
})

userRouter.post('/', async(req, res) => {
  const body = req.body
  console.log(body)
  const saltRounds = 10
  if (body.password === undefined || body.username === undefined){
    console.log(body, body.password, body.username)
    throw Error('ValidationError')
  }
  if (body.password.length < 3) {
    throw Error('password too short')
  }
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const newUser = new User({
    name: body.name,
    username: body.username,
    passwordHash
  })
  console.log(newUser)
  const savedUser = await newUser.save()

  res.json(savedUser)

})

module.exports = userRouter
