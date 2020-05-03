const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))

  //  .catch(error => console.log(error))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if (!(blog.likes)) blog.likes = 0
  const savedBlog = await blog.save()

  return response.status(201).json(savedBlog)

})

module.exports = blogsRouter
