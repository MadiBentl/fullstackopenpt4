const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  console.log(blog)
  if (!request.token || !decodedToken){
    return response.status(401).json({ error: 'token missing' })
  }
  const user = await User.findOne({})
  blog.date = new Date()
  blog.user = user._id
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  console.log('bodh', request.body)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  console.log('updated', updatedBlog)
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
