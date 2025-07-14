const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const realId = '6873c65e36c7cb53e4963bc0'
const userForToken = {
  username: 'test user',
  id: realId
}
const token = jwt.sign(userForToken, process.env.SECRET)
const auth = 'Bearer '.concat(token)

beforeEach(async () => {
  await Blog.deleteMany({})

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salasana', 10)
  const user = new User({
    username: userForToken.username,
    passwordHash,
    _id: realId,
    blogs: []
  })
  await user.save()

  for(let blog of helper.blogs){
    const newBlog = new Blog(blog)
    const savedBlog = await newBlog.save()
    const dbUser = await User.findById(realId)
    dbUser.blogs = dbUser.blogs.concat(savedBlog._id)
    await dbUser.save()
  }
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
    .set('Authorization', auth)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert(blogsAtEnd.length, helper.blogs.length + 1)
})

test('likes property defaults to 0', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', auth)
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

describe('deletion of a blog', () => {
  test('succeeds with status code 204 valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', auth)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, helper.blogs.length - 1)
  })

  test('fails with status code 400 with an invalid id', async () => {
    const invalidId = 463527
    await api.delete(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('updating a blog', () => {
  test('succeeds with an existing id', async () => {
    const id = helper.blogs[0]._id
    const updated = { ...helper.blogs[0], title: 'updated title' }

    await api
      .put(`/api/blogs/${id}`)
      .send(updated)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('updated title'))
  })

  test('fails with an invalid id', async () => {
    const invalidId = 7562385902
    const updated = { ...helper.blogs[0], title: 'updated title' }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updated)
      .expect(400)
  })

  test('fails with a non existent id', async () => {
    const nonexisting = '5a422a851b54a676234d17f8'
    const updated = { ...helper.blogs[0], title: 'updated title' }

    await api
      .put(`/api/blogs/${nonexisting}`)
      .send(updated)
      .expect(404)
  })
})

describe("user creation", () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testi',
      name: 'test user',
      password: 'salainensana',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails with an invalid password (length < 3)', async () => {
    const newUser = {
      username: 'testi',
      name: 'test user',
      password: '12',
    }

    const error = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    assert(error.body.error.includes('password must be atleast 3 characters long'))
  })

  test('fails with a non unique username', async () => {
    const newUser = {
      username: 'test user',
      name: 'test user',
      password: '123',
    }

    const error = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(error.body.error.includes('expected `username` to be unique'))
  })

  test('fails with an invalid username (length < 3)', async () => {
    const newUser = {
      username: 'ro',
      name: 'test user',
      password: '123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})