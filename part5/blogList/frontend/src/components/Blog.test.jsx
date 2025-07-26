import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const testUser = {
  username: 'testUser',
  name: 'TesterName'
}
const blog = {
  title: 'testBlog',
  author: 'testAuthor',
  url: 'test.com',
  likes: 19,
  user: testUser
}

describe('Blog renders ', () => {
  test('only title and author initially', () => {
    const updateHandler = vi.fn()
    const removeHandler = vi.fn()

    render(
      <Blog blog={blog} updateBlog={updateHandler} removeBlog={removeHandler} user={testUser}/>
    )
    const title = screen.queryByText(blog.title)
    const author = screen.queryByText(blog.author)
    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(title).toBeDefined()
    expect(author).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('url and likes when view button is pressed', async () => {
    const updateHandler = vi.fn()
    const removeHandler = vi.fn()

    render(
      <Blog blog={blog} updateBlog={updateHandler} removeBlog={removeHandler} user={testUser}/>
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText(blog.url)
    const likes = screen.queryByText(`likes ${blog.likes}`)
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
  })
})

test('if a blog is liked twice, updateBlog is also called twice', async () => {
  const updateHandler = vi.fn()
  const removeHandler = vi.fn()

  render(
    <Blog blog={blog} updateBlog={updateHandler} removeBlog={removeHandler} user={testUser}/>
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateHandler.mock.calls).toHaveLength(2)
})