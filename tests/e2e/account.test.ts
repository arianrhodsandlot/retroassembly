import { expect, test } from '@playwright/test'

test('create an account', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Username').fill('testuser')
  await page.getByLabel('Password').first().fill('testpassword1')
  await page.getByLabel('Repeat password').fill('testpassword2')
  await page.getByText('Create Your Account').click()
  await page.getByText('Passwords do not match').waitFor()

  await page.getByLabel('Password').first().fill('testpassword')
  await page.getByLabel('Repeat password').fill('testpassword')
  await page.getByText('Create Your Account').click()
  await page.waitForURL('/library')
})

test('log in', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Username').fill('testuser')
  await page.getByLabel('Password').first().fill('testpassword1')
  await page.locator('button').getByText('Log in').click()
  await page.getByText('Invalid username or password').waitFor()

  await page.getByLabel('Username').fill('testuser')
  await page.getByLabel('Password').first().fill('testpassword')
  await page.locator('button').getByText('Log in').click()
  await page.waitForURL('/library')
})

test('log out', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Username').fill('testuser')
  await page.getByLabel('Password').first().fill('testpassword')
  await page.locator('button').getByText('Log in').click()

  await page.getByTitle('Menu').click()
  await page.getByText('Log out').click()
  await page.locator('button').getByText('Log out').click()
  await expect(page).toHaveURL('')
})
