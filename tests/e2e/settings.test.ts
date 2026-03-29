import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, userTest)

test('open settings dialog', async ({ page, pages: { login, settings }, user }) => {
  await login.login(user)
  await settings.open()

  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('tab', { name: 'library' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'inputs' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'emulating' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'general' })).toBeVisible()
})

test('toggle bilinear filtering setting', async ({ page, pages: { login, settings }, user }) => {
  await login.login(user)
  await settings.open()
  await settings.switchTab('emulating')

  const initialState = await settings.isBilinearFilteringEnabled()
  await settings.toggleBilinearFiltering()

  const newState = await settings.isBilinearFilteringEnabled()
  expect(newState).not.toBe(initialState)

  await settings.toggleBilinearFiltering()
})

test('reset all settings', async ({ page, pages: { login, settings }, user }) => {
  await login.login(user)
  await settings.open()
  await settings.switchTab('library')

  await page.getByRole('button', { name: /reset to defaults/i }).click()
  await expect(page.getByRole('dialog').filter({ hasText: /reset to defaults/i })).toBeVisible()

  await page.getByRole('button').getByText(/reset/i).click()
  await page.waitForTimeout(100)

  await expect(page.getByRole('dialog').first()).toBeVisible()
})
