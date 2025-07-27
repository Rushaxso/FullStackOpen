const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'salasana'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Wrong User',
        username: 'test2',
        password: 'sanasala'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'salasana')
      await expect(page.getByText('blogs')).toBeVisible()
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'test', 'wrong password')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      const blog1 = {
        title: 'testBlog',
        author: 'testAuthor',
        url: 'test.com',
        likes: 0
      }
      const blog2 = {
        title: 'testBlog2',
        author: 'testAuthor2',
        url: 'test2.com',
        likes: 0
      }

      beforeEach(async ({ page }) => {
        await loginWith(page, 'test', 'salasana')
        await createBlog(page, blog1)
      })

      test('a new blog can be created', async ({ page }) => {
        await expect(page.getByText(`${blog1.title} ${blog1.author}`)).toBeVisible()

        const notifDiv = page.locator('.notification')
        await expect(notifDiv).toContainText(`A new blog ${blog1.title} by ${blog1.author} added`)
        await expect(notifDiv).toHaveCSS('border-style', 'solid')
        await expect(notifDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      })

      test('a blog can be liked', async ({ page }) => {
        await likeBlog(page, blog1)
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('user who added a blog can delete that blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText(`${blog1.title} ${blog1.author}`)).not.toBeVisible()
      })

      test('only the user who added a blog, can see the delete button', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'test2', 'sanasala')
        await expect(page.getByText('Wrong User logged in')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('blogs are arranged in the order according to the likes', async ({ page }) => {
        await createBlog(page, blog2)
        let testBlog1 = { ...blog1 }
        let testBlog2 = { ...blog2 }
        const likesBlog1 = 2
        const likesBlog2 = 8
        const moreLikes = likesBlog1 >= likesBlog2 ? likesBlog1 : likesBlog2
        const lessLikes = likesBlog1 >= likesBlog2 ? likesBlog2 : likesBlog1

        for(let i = 0; i < likesBlog1; i++){
          testBlog1 = await likeBlog(page, testBlog1)
        }
        for(let i = 0; i < likesBlog2; i++){
          testBlog2 = await likeBlog(page, testBlog2)
        }
        let blogs = await page.locator('.blog')
        for(let i = 0; i < await blogs.count(); i++){
          await blogs.nth(i).getByRole('button', { name: 'view' }).click()
        }

        await expect(blogs.nth(0).getByText(`likes ${moreLikes}`)).toBeVisible()
        await expect(blogs.nth(1).getByText(`likes ${lessLikes}`)).toBeVisible()
      })
    })
  })
})