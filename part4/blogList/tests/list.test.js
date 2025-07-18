const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has many blogs, equals the total likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })

  test('when list has no blogs, equals 0', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
})

describe('favorite blog', () => {
  test('is the only blog in the list if length is 1', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), listWithOneBlog[0])
  })

  test('is the blog with most likes if length > 1', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })

  test('equals to \'no blogs\' if list is empty', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), 'no blogs')
  })
})

describe('most blogs', () => {
  test('is the given author (blogs 1) when length is 1', () => {
    const result = { author: "Edsger W. Dijkstra", blogs: 1 }
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), result)
  })

  test('is the author with the most blogs when list length > 1', () => {
    const result = { author: "Robert C. Martin", blogs: 3 }
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), result)
  })

  test('returns author as null when given an empty list', () => {
    const result = { author: null, blogs: 0 }
    assert.deepStrictEqual(listHelper.mostBlogs([]), result)
  })
})

describe('most likes', () => {
  test('is the given author when length is 1', () => {
    const result = { author: "Edsger W. Dijkstra", likes: 5 }
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), result)
  })

  test('is the author with the most likes when list length > 1', () => {
    const result = { author: "Edsger W. Dijkstra", likes: 17 }
    assert.deepStrictEqual(listHelper.mostLikes(blogs), result)
  })

  test('returns author as null when given an empty list', () => {
    const result = { author: null, likes: 0 }
    assert.deepStrictEqual(listHelper.mostLikes([]), result)
  })
})