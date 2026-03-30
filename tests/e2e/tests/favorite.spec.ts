import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from '../fixtures/pages.ts'
import { test as romsTest } from '../fixtures/roms.ts'
import { test as userTest } from '../fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('add to favorites', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  const title = (await page.locator('.game-entry').textContent()) || ''

  await page.getByLabel('add to favorites').click()

  await page.goto('library/favorites')
  await expect(page.getByText(title)).toBeVisible()
})

test('remove from favorites', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  const title = (await page.locator('.game-entry').textContent()) || ''

  await page.getByLabel('add to favorites').click()
  await page.goto('library/favorites')
  await expect(page.getByText(title)).toBeVisible()

  await page.getByLabel('remove from favorites').click()
  await expect(page.getByText(title)).not.toBeVisible()
})
