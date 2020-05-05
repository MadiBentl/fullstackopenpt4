const bcrypt = require('bcrypt')
const User = require('../models/user')
const userRouter = require('express').Router()

userRouter.get('/', async(req, res) => {
  const users = await User.find({})
  res.send(users.map(user => user.toJSON()))
})

userRouter.post('/', async(req, res) => {
  const body = req.body
  const saltRounds = 10
  if (body.passwordHash.length < 3) {
    throw Error('password too short')
  }
  const passwordHash = await bcrypt.hash(body.passwordHash, saltRounds)
  const newUser = new User({
    name: body.name,
    username: body.username,
    passwordHash
  })

  const savedUser = await newUser.save()

  res.json(savedUser)

})

module.exports = userRouter
