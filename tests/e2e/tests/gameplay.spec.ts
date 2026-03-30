import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from '../fixtures/pages.ts'
import { test as romsTest } from '../fixtures/roms.ts'
import { test as userTest } from '../fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('launch a game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await expect(page).toHaveScreenshot()
  await page.keyboard.press('ArrowDown', { delay: 100 })
  await expect(page).toHaveScreenshot()
})

test('continue a game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await expect(page).toHaveScreenshot()
  await page.keyboard.press('ArrowDown', { delay: 100 })
  await expect(page).toHaveScreenshot()

  await page.keyboard.press('Escape')
  await page.getByRole('button').filter({ hasText: 'save & exit' }).click()
  await page.locator('#canvas').waitFor({ state: 'detached' })
  await page.getByText('continue').click()
  await expect(page).toHaveScreenshot()
})

test('pause and resume game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await expect(page.getByTitle('pause')).not.toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByText('resume')).toBeVisible()

  await page.getByText('resume').click()

  await expect(page.getByText('resume')).not.toBeVisible()
})

test('restart game during gameplay', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await expect(page.getByTitle('pause')).not.toBeVisible()

  await page.keyboard.press('Escape')
  await page.getByText('restart').click()

  await page.keyboard.press('Escape')
  await expect(page.getByText('resume')).toBeVisible()
})

test('exit game without saving', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.getByTitle('pause').waitFor({ state: 'detached' })

  await page.waitForSelector('#canvas')

  await page.keyboard.press('Escape')
  await page.getByText('Exit', { exact: true }).click()

  await expect(page.locator('#canvas')).not.toBeVisible()
})
