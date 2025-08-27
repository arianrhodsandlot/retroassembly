import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(userTest, pagesTest)

test('log in', async ({ page, pages: { library, login }, user }) => {
  await login.login(user.username, `${user.password}1`, false)
  await expect(page.getByText('Invalid username or password')).toBeAttached()

  await login.login(user.username, user.password, false)
  await expect(page).toHaveURL(library.url)
})

test('log out', async ({ page, pages: { library, login }, user }) => {
  await login.login(user.username, user.password)
  await library.logout()
  await expect(page).toHaveURL('')

  await library.goto()
  await expect(page).toHaveURL(login.url)
})

test('update password', async ({ page, pages: { library, login }, user }) => {
  await login.login(user.username, user.password)

  await library.gotoSettingsTab('Account')
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

  await library.closeSettings()
  await library.logout()
  await login.login(user.username, 'testpassword1')
  await expect(page).toHaveURL('/library')
})
