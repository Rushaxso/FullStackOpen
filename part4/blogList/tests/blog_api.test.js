const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returns the correct amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.blogs.length)
})

test('unique identifier property of blog posts are named id (not _id)', async () => {
  const response = await api.get('/api/blogs')
  const identifiers = response.body.map(blog => blog.id)
  const testId = (a, b) => a && b
  assert(identifiers.reduce(testId))
})

test('a valid blog can be added', async () => {
  await api.
    post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length, helper.blogs.length + 1)
})

test('likes property defaults to 0', async () => {
  await api
    .post('/api/blogs')
    .send(helper.noLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert((blogsAtEnd.find(blog =>
    blog.title === 'tästä ei tykätty :('))
    .likes === 0
  )

})

test('backend responds with code 400 when title or url missing', async () => {
  await api
    .post('/api/blogs')
    .send(helper.noTitle)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .send(helper.noUrl)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})