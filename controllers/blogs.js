const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  res.json(blog.toJSON())
})
blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = new Comment(request.body)
  const blog = await Blog.findById(request.params.id)
  comment.blog = blog._id
  console.log('comment:', comment)
  const savedComment = await comment.save()
  response.json(savedComment.toJSON())
})
blogsRouter.get('/:id/comments', async (request, response) => {
  const comments = await Comment.find({ blog: request.params.id })
  response.json(comments.map(comment => comment.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken){
    return response.status(401).json({ error: 'token missing' })
  }
  const user = await User.findOne({ username: decodedToken.user })
  blog.date = new Date()
  blog.user = user._id
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken){
    return response.status(401).json({ error: 'not logged in / missing token' })
  }
  if ( blog.user.toString() === decodedToken.id.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).json(blog)
  }
})

blogsRouter.put('/:id', async (request, response) => {
  if (request.body.user.username){
    request.body.user = request.body.username
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
