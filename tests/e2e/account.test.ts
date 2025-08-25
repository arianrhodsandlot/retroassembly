import { expect } from '@playwright/test'
import { test } from './fixtures/test.ts'

// test('create an account', async ({ page }) => {
//   const loginPage = new LoginPage(page)

//   await loginPage.goto()
//   await loginPage.createAccount('testuser', 'testpassword1', 'testpassword2')
//   await expect(page.getByText('Passwords do not match')).toBeAttached()

//   await loginPage.createAccount('testuser', 'testpassword', 'testpassword')
//   await expect(page).toHaveURL('/library')
// })

test('log in', async ({ page, pages, user }) => {
  await pages.login.login(user.username, `${user.password}1`)
  await expect(page.getByText('Invalid username or password')).toBeAttached()

  await pages.login.login(user.username, user.password)
  await expect(page).toHaveURL('/library')
})

test('log out', async ({ page, pages, user }) => {
  await pages.login.login(user.username, user.password)
  await pages.library.logout()
  await expect(page).toHaveURL('')

  await pages.library.goto()
  await expect(page).toHaveURL('/login')
})

test('update password', async ({ page, pages, user }) => {
  await pages.login.login(user.username, user.password)

  await pages.library.gotoSettingsTab('Account')
  await page.getByLabel('Current Password').fill('testpassword')
  await page.getByLabel('New Password').first().fill('testpassword1')
  await page.getByLabel('Repeat New Password').first().fill('testpassword2')
  await page.getByText('Update Password').click()
  await expect(page.getByText('Passwords do not match')).toBeAttached()

  await page.getByLabel('Current Password').fill('testpassword3')
  await page.getByLabel('New Password').first().fill('testpassword')
  await page.getByLabel('Repeat New Password').first().fill('testpassword')
  await page.getByText('Update Password').click()
  await expect(page.getByText('Invalid current password')).toBeAttached()

  await page.getByLabel('Current Password').fill('testpassword')
  await page.getByLabel('New Password').first().fill('testpassword1')
  await page.getByLabel('Repeat New Password').first().fill('testpassword1')
  await page.getByText('Update Password').click()
  await expect(page.getByText('Your password has been updated')).toBeAttached()

  await pages.library.closeSettings()
  await pages.library.logout()
  await pages.login.login(user.username, 'testpassword1')
  await expect(page).toHaveURL('/library')
})
