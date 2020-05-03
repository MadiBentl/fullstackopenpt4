const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))

})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.date = new Date()
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
