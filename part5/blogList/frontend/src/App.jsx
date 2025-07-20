import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
 
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      showNotification('Logginf out failed', setError)
    }
  }

  const createBlog = async (blog) => {
    try{
      const newBlog = await blogService.create(blog)
      setBlogs(blogs.concat(newBlog))
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

  const blogForm = () => {
    return (
      <BlogForm createBlog={createBlog}/>
    )
  }

  const showNotification = (message, setFucntion) => {
    setFucntion(message)
    setTimeout(() => {
      setFucntion(null)
    }, 5000)
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
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App