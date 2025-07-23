import {useState} from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [detailsVisible, setDetailsVisible] = useState(false)
  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }
  const buttonText = detailsVisible ? 'hide' : 'view'
  
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{buttonText}</button>
        {detailsVisible && 
          <div>
            {blog.url}<br/>
            likes {blog.likes} 
            <button onClick={() => updateBlog(blog)}>like</button><br/>
            {blog.user.name}<br/>
            {blog.user.username === user.username && 
              <button onClick={() => removeBlog(blog)}>remove</button>
            } 
          </div>
        }
      </div>
  </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog