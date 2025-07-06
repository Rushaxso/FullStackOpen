const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0){
    return 'no blogs'
  }
  let most = blogs[0]
  for(let i = 0; i < blogs.length; i++){
    const blog = blogs[i]
    if(blog.likes > most.likes){
      most = blog
    }
  }
  return most
}

const mostBlogs = (blogs) => {
  const authorBlogs = {}
  for(let i = 0; i < blogs.length; i++){
    const blog = blogs[i]
    authorBlogs[blog.author] = (authorBlogs[blog.author] || 0) + 1
  }

  let topAuthor = null
  let mostBlogs = 0

  const entries = Object.entries(authorBlogs)
  for(let i = 0; i < entries.length; i++){
    const [author, blogs] = entries[i]
    if(blogs > mostBlogs){
      topAuthor = author
      mostBlogs = blogs
    }
  }
  return {
    author: topAuthor,
    blogs: mostBlogs
  }
}

const mostLikes = (blogs) => {
  const authorLikes = {}
  for(let i = 0; i < blogs.length; i++){
    const blog = blogs[i]
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
  }

  let topAuthor = null
  let mostLikes = 0

  const entries = Object.entries(authorLikes)
  for(let i = 0; i < entries.length; i++){
    const [author, likes] = entries[i]
    if(likes > mostLikes){
      topAuthor = author
      mostLikes = likes
    }
  }
  return {
    author: topAuthor,
    likes: mostLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}