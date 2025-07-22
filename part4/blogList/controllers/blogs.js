const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/user')
//const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = request.user
  if(!user){
    return response.status(400).json({ error: "userId missing or not valid" })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if(!user){
    return response.status(400).json({ error: "userId missing or not valid" })
  }
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    return response.status(400).json({ error: "blogId missing or not valid" })
  }

  if(blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(400).json({ error: "ids did not match" })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const user = request.user
  if(!user){
    return response.status(400).json({ error: "userId missing or not valid" })
  }

  const id = request.params.id
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updated = await Blog.findByIdAndUpdate(id, blog)
  if(updated){
    response.json(updated)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter