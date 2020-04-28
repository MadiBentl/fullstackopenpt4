const _ = require('lodash')

const dummy = blogs => {
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
  let fav = {likes:0}

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

  let favAuthor = Object.keys(blogObj).reduce((a, b) => blogObj[a] > blogObj[b] ? a : b);
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

  let maxLikes = Object.keys(blogObj).reduce((a, b) => blogObj[a] > blogObj[b] ? a : b);
  maxLikes = {
    author: maxLikes,
    likes: blogObj[maxLikes]
  }
  return maxLikes;
}

module.exports = {dummy, totalLikes, favouriteArticle, mostBlogs, mostLikes}
