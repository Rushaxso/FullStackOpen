const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('title').fill(blog.title)
  await page.getByTestId('author').fill(blog.author)
  await page.getByTestId('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${blog.title} ${blog.author}`).waitFor()
}

const likeBlog = async (page, blog) => {
  const blogDiv = await page.getByText(`${blog.title} ${blog.author}`)
  await blogDiv.getByRole('button', { name: 'view' }).click()
  await blogDiv.getByRole('button', { name: 'like' }).waitFor()
  await blogDiv.getByRole('button', { name: 'like' }).click()
  await blogDiv.getByText(`likes ${blog.likes + 1}`).waitFor()
  await blogDiv.getByRole('button', { name: 'hide' }).click()
  await blogDiv.getByRole('button', { name: 'view' }).waitFor()
  return { ...blog, likes: blog.likes + 1 }
}
export { loginWith, createBlog, likeBlog }