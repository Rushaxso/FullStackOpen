import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'testBlog',
  author: 'testAuthor',
  url: 'test.com'
}
test('BlogForm calls eventhandler with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog}/>)

  const titleInput = screen.getByPlaceholderText('write title here')
  const authorInput = screen.getByPlaceholderText('write author here')
  const urlInput = screen.getByPlaceholderText('write url here')

  await user.type(titleInput, blog.title)
  await user.type(authorInput, blog.author)
  await user.type(urlInput, blog.url)

  const createButton = screen.getByText('create')
  await user.click(createButton)
  
  const mockCall = createBlog.mock.calls[0][0]
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(mockCall.title).toBe(blog.title)
  expect(mockCall.author).toBe(blog.author)
  expect(mockCall.url).toBe(blog.url) 
})