import { useState } from 'react'

const Input = ({name, variable, setVariable, placeHolder}) => {
    return (
      <div>
        {name}:
        <input
          data-testid={name}
          type="text"
          value={variable}
          name={name}
          onChange={({target}) => setVariable(target.value)}
          placeholder={placeHolder}
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
        <Input name={'title'} variable={title} setVariable={setTitle} placeHolder={'write title here'}/>
        <Input name={'author'} variable={author} setVariable={setAuthor} placeHolder={'write author here'}/>
        <Input name={'url'} variable={url} setVariable={setUrl} placeHolder={'write url here'}/>
        <button type ="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm