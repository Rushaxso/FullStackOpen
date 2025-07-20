import { useState } from 'react'

const Input = ({name, variable, setVariable}) => {
    return (
      <div>
        {name}:
        <input
          type="text"
          value={variable}
          name={name}
          onChange={({target}) => setVariable(target.value)}
        />
      </div>
    )
  }

const BlogForm = ({createBlog}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addNewBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url
    }
    createBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={addNewBlog}>
        <Input name={'title'} variable={title} setVariable={setTitle}/>
        <Input name={'author'} variable={author} setVariable={setAuthor}/>
        <Input name={'url'} variable={url} setVariable={setUrl}/>
        <button type ="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm