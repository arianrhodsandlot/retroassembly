import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as romsTest } from './fixtures/roms.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('upload roms', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await Promise.all(roms.map(({ title }) => expect(page.getByText(title)).toHaveCount(1)))
})

test('delete roms', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  // Get the first game title before deleting
  const firstGame = page.locator('.game-entry').first()
  const firstGameTitle = (await firstGame.textContent()) ?? ''
  const firstGameName = firstGameTitle.trim().split('\n')[0].trim()

  await page.getByRole('main').getByLabel('menu').first().click()
  await page.getByText('delete the rom').click()
  await page.getByRole('button').getByText('delete').click()

  // Check the deleted game is gone, and at least one other game remains
  await expect(page.getByText(firstGameName)).toHaveCount(0)
  await expect(page.locator('.game-entry')).toHaveCount(roms.length - 1)
})

test('launch a game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await expect(page).toHaveScreenshot()
  await page.keyboard.press('ArrowDown', { delay: 100 })
  await expect(page).toHaveScreenshot()
})

test('continue a game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.keyboard.press('ArrowDown', { delay: 100 })
  await expect(page).toHaveScreenshot()

  await page.keyboard.press('Escape')
  await page.getByRole('button').filter({ hasText: 'save & exit' }).click()
  await page.getByText('continue').click()
  await expect(page).toHaveScreenshot()
})
