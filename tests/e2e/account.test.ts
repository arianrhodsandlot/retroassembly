import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(userTest, pagesTest)

test('log in', async ({ page, pages: { library, login }, user }) => {
  await login.login({ ...user, password: `${user.password}1` }, false)
  await expect(page.getByText('invalid username or password')).toBeAttached()

  await login.login(user, false)
  await expect(page).toHaveURL(library.url)
})

test('log out', async ({ page, pages: { library, login }, user }) => {
  await login.login(user)
  await library.logout()
  await expect(page).toHaveURL('')

  await library.goto()
  await expect(page).toHaveURL(login.url)
})

test('update password', async ({ page, pages: { library, login }, user }) => {
  await login.login(user)

  await library.gotoSettingsTab('account')
  await page.getByLabel('current password').fill(user.password)
  await page.getByLabel('new password').first().fill('new_password')
  await page.getByLabel('repeat new password').first().fill('wrong_new_password')
  await page.getByText('update password').click()
  await expect(page.getByText('passwords do not match')).toBeAttached()

  await page.getByLabel('current password').fill('wrong_password')
  await page.getByLabel('new password').first().fill('new_password')
  await page.getByLabel('repeat new password').first().fill('new_password')
  await page.getByText('update password').click()
  await expect(page.getByText('invalid current password')).toBeAttached()

  await page.getByLabel('current password').fill(user.password)
  await page.getByLabel('new password').first().fill('new_password')
  await page.getByLabel('repeat new password').first().fill('new_password')
  await page.getByText('update password').click()
  await expect(page.getByText('your password has been updated')).toBeAttached()

  await library.closeSettings()
  await library.logout()
  await login.login({ ...user, password: 'new_password' })
  await expect(page).toHaveURL('/library')
})
