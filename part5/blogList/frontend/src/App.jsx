import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
 
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const blogFormRef = useRef()

  const refresh = async () => {
    const blogs = await blogService.getAll()
    blogs.sort((blog1, blog2) => blog2.likes - blog1.likes)
    setBlogs(blogs)
  }
  useEffect(() => {
    refresh() 
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      showNotification('Wrong credentials', setError)
    }
  }

  const handleLogout = () => {
    try{
      window.localStorage.removeItem('loggedUser')
      setUser(null)
    } catch {
      showNotification('Logging out failed', setError)
    }
  }

  const createBlog = async (blog) => {
    try{
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create(blog)
      refresh()
      showNotification(`A new blog ${blog.title} by ${blog.author} added`, setNotification)
    } catch {
      showNotification('Creating blog failed', setError)
    }
  }

  const loginForm = () => {
    return (
      <LoginForm
        username={username}
        onUsernameChange={({target}) => setUsername(target.value)}
        password={password}
        onPasswordChange={({target}) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    )
  }

  const showNotification = (message, setFucntion) => {
    setFucntion(message)
    setTimeout(() => {
      setFucntion(null)
    }, 5000)
  }

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = {...blog, likes: blog.likes + 1, user: blog.user.id}
      delete updatedBlog.id
      const replacedBlog = await blogService.update(blog.id, updatedBlog)
      refresh()
      showNotification(`Blog ${blog.title} by ${blog.author} was liked :)`, setNotification)
    } catch {
      showNotification('Liking blog failed :(', setError)
    }
  }

  const removeBlog = async (blog) => {
    try {
      if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
        await blogService.remove(blog.id)
        refresh()
        showNotification(`Blog ${blog.title} removed successfully`, setNotification)
      }
    } catch {
      showNotification('Removing blog failed', setError)
    }
  }

  return (
    <div>
      {user === null ?
        <div>
          <h2>log in to application</h2>
          <Notification message={error} className={'error'} />
          {loginForm()}
        </div> 
        :
        <div>
          <h2>blogs</h2>
          <Notification message={notification} className={'notification'} />
          <Notification message={error} className={'error'} />
          <div>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </div>
          <br/>
          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}  updateBlog={updateBlog} removeBlog={removeBlog} user={user}/>
          )}
        </div>
      }
    </div>
  )
}

export default App