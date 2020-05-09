const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
  {
    name: 'Monkey St James',
    username: 'HolyMonkey',
    password: 'password',
    id: '5eb620edf6005b555e7ba8a8'
  },
  {
    name: 'Baby Monkey',
    username: 'googoo',
    password: 'password',
    id: '5eb202610215363997353a60'
  }
]

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
    user: '123'
  }
]

const listWithMultipleBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
    user: '5eb620edf6005b555e7ba8a8'
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  let total = 0
  blogs.forEach(blog => {
    total += blog.likes
  })
  return total
}

const favouriteArticle = blogs => {
  let fav = { likes:0 }

  blogs.forEach(blog => {
    if (blog.likes > fav.likes){
      fav = blog
    }
  })
  return fav
}

const mostBlogs = blogs => {
  let blogObj = {}
  blogs.forEach(blog => {
    if (blogObj[blog.author]){
      blogObj[blog.author] += 1
    }else{
      blogObj[blog.author] = 1
    }
  })

  let favAuthor = Object.keys(blogObj).reduce((a, b) => blogObj[a] > blogObj[b] ? a : b)
  favAuthor = {
    author: favAuthor,
    blogs: blogObj[favAuthor]
  }
  return favAuthor
}

const mostLikes = blogs => {
  let blogObj = {}
  blogs.forEach(blog => {
    if (blogObj[blog.author]){
      blogObj[blog.author] += blog.likes
    }else{
      blogObj[blog.author] = blog.likes
    }
  })

  let maxLikes = Object.keys(blogObj).reduce((a, b) => blogObj[a] > blogObj[b] ? a : b)
  maxLikes = {
    author: maxLikes,
    likes: blogObj[maxLikes]
  }
  return maxLikes
}

module.exports = { initialUsers, dummy, totalLikes, favouriteArticle, mostBlogs, blogsInDb, usersInDb, mostLikes, listWithOneBlog, listWithMultipleBlogs }
