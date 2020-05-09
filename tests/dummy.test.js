const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const api = supertest(app)
const bcrypt = require('bcrypt')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

beforeEach( async () => {
  await Blog.deleteMany({})
  const blogsObject = listHelper.listWithMultipleBlogs.map(blog => new Blog(blog))
  const blogPromise = blogsObject.map(blog => blog.save())
  await Promise.all(blogPromise)

  await User.deleteMany({})

  const usersObject = await Promise.all(
    listHelper.initialUsers.map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10)
      const newUser = {
        user: user.name,
        username: user.username,
        _id: user.id,
        passwordHash
      }
      return await new User(newUser)
    })
  )
  const userPromise = usersObject.map(user => user.save())
  await Promise.all(userPromise)

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
    const loggedIn = await api.post('/api/login').send(listHelper.initialUsers[0])
    const token = 'Bearer ' + loggedIn.body.token
    const newBlog = {
      title: 'Gnarly Hands',
      author: 'Baby Monkey',
      url: 'https://monkeyhands.com/',
      likes: 11
    }
    console.log(token)
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let response = await listHelper.blogsInDb()
    expect(response).toHaveLength(listHelper.listWithMultipleBlogs.length + 1)
    const contents = response.map(r => r.title)
    expect(contents).toContain(newBlog.title)
  })

  test('verifies that if likes are missing, it will be added with value of 0', async () => {
    const loggedIn = await api.post('/api/login').send(listHelper.initialUsers[0])
    const token = 'Bearer ' + loggedIn.body.token

    const newBlog = {
      title: 'Gnarly Hands',
      author: 'Baby Monkey',
      url: 'https://monkeyhands.com/'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    let response = await listHelper.blogsInDb()
    expect(response).toHaveLength(listHelper.listWithMultipleBlogs.length + 1)
    expect(response[response.length -1 ].likes).toEqual(0)
  })

  test('url and title are required fields', async () => {
    const loggedIn = await api.post('/api/login').send(listHelper.initialUsers[0])
    const token = 'Bearer ' + loggedIn.body.token

    const newBlog = {
      author: 'Baby Monkey'
    }
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(400)

  })

  test('can delete a blog', async () => {
    const loggedIn = await api.post('/api/login').send(listHelper.initialUsers[0])
    const token = 'Bearer ' + loggedIn.body.token
    const allBlogs = await listHelper.blogsInDb()
    const blogToDelete = allBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204)
  })

  test('can update a blog', async() => {
    const allBlogs = await listHelper.blogsInDb()
    const blogToUpdate = allBlogs[0]
    const newContent = { likes: 700 }

    const res = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newContent)
      .expect(200)

    expect(res.body.likes).toEqual(700)
  })
})

describe('user api requests', () => {
  test('returns a list of users', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = await listHelper.usersInDb()

    expect(users).toHaveLength(listHelper.initialUsers.length)
  })

  test('returns a 400 error for incorrect requests', async () => {
    const incompleteUser = new User({
      name: 'John-o'
    })

    await api
      .post('/api/users')
      .send(incompleteUser)
      .expect(400)

    const users = await listHelper.usersInDb()
    expect(users).toHaveLength(listHelper.initialUsers.length)
  })

  test('adds a new user to the db', async () => {
    const usersAtStart = await listHelper.usersInDb()
    const newUser = ({
      name: 'Monkey Smith',
      username: 'mistermonkey666',
      password: '1213'
    })
    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)

    const users = await listHelper.usersInDb()
    expect(users).toHaveLength(usersAtStart.length + 1)
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
