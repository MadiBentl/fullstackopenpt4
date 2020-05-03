const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const api = supertest(app)
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog.js')

beforeEach( async () => {
  await Blog.deleteMany({})
  const blogsObject = listHelper.listWithMultipleBlogs.map(blog => new Blog(blog))
  const blogPromise = blogsObject.map(blog => blog.save())
  await Promise.all(blogPromise)

})
describe('api requests', () => {
  test('returns api get request', async() => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns id not _id', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })

  test('posts a new blog', async () => {
    const newBlog = {
      title: 'Gnarly Hands',
      author: 'Baby Monkey',
      url: 'https://monkeyhands.com/',
      likes: 11
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let response = await listHelper.blogsInDb()
    expect(response).toHaveLength(listHelper.listWithMultipleBlogs.length + 1)
    console.log(response)
    const contents = response.map(r => r.title)
    expect(contents).toContain(newBlog.title)
  })
  test('verifies that if likes are missing, it will be added with value of 0', async () => {
    const newBlog = {
      title: 'Gnarly Hands',
      author: 'Baby Monkey',
      url: 'https://monkeyhands.com/'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let response = await listHelper.blogsInDb()
    expect(response).toHaveLength(listHelper.listWithMultipleBlogs.length + 1)
    console.log(response[response.length -1 ])
    expect(response[response.length -1 ].likes).toEqual(0)
  })
})

describe('favourite blog', () => {

  test('favourite blog returns only blog when there is only one blog', () => {
    const result = listHelper.favouriteArticle(listHelper.listWithOneBlog)
    expect(result).toBe(listHelper.listWithOneBlog[0])
  })

  test('favourite blog returns fav of multiple blogs', () => {
    const result = listHelper.favouriteArticle(listHelper.listWithMultipleBlogs)
    expect(result).toEqual(listHelper.listWithMultipleBlogs[2])
  })
})

describe('most prolific author', () => {

  test('returns author with most blogs, multiple blogs', () => {
    const result = listHelper.mostBlogs(listHelper.listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('returns author with most blogs, one blog', () => {
    const result = listHelper.mostBlogs(listHelper.listWithOneBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })
})

describe('most likes', () => {

  test('when list has only one blog equals the max links of most popular author', () => {
    const result = listHelper.mostLikes(listHelper.listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  test('when list has multiple items it should find author with most likes', () => {
    const result = listHelper.mostLikes(listHelper.listWithMultipleBlogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

})

describe('total likes', () => {

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has multiple items it should sum the likes', () => {
    const result = listHelper.totalLikes(listHelper.listWithMultipleBlogs)
    expect(result).toBe(36)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
