import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as romsTest } from './fixtures/roms.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('pause and resume game', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('resume')).toBeVisible({ timeout: 10_000 })

  await page.getByText('resume').click()
  await page.waitForTimeout(500)

  await expect(page.getByText('resume')).not.toBeVisible()
})

test('restart game during gameplay', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('restart')).toBeVisible({ timeout: 10_000 })
  await page.getByText('restart').click()

  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('resume')).toBeVisible({ timeout: 10_000 })
})

test('exit game without saving', async ({ page, pages: { library, login }, roms, user }) => {
  test.setTimeout(60_000)
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').first().click()
  await page.waitForTimeout(500)
  await page.getByRole('button', { name: /start/i }).click()
  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('Exit', { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.getByText('Exit', { exact: true }).click()

  await expect(page.getByRole('heading', { name: 'babelblox' })).toBeVisible({ timeout: 30_000 })
  await expect(page.getByRole('button', { exact: true, name: 'Start' })).toBeVisible()
})

test('create manual save state during gameplay', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('save state', { exact: false })).toBeVisible({ timeout: 10_000 })
  await page.getByText('save state', { exact: false }).click()
  await page.waitForTimeout(1500)

  await page.getByText('resume').click()
  await page.waitForTimeout(500)

  await page.keyboard.press('Escape')
  await expect(page.getByText('save & exit')).toBeVisible({ timeout: 10_000 })
  await page.getByText('save & exit').click()

  await page.waitForURL(/\/library/, { timeout: 30_000 })
})

test('continue game from save state', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.waitForTimeout(3000)
  await page.keyboard.press('Escape')
  await expect(page.getByText('save state', { exact: false })).toBeVisible({ timeout: 10_000 })
  await page.getByText('save state', { exact: false }).click()
  await page.waitForTimeout(1500)
  await page.getByText('save & exit').click()

  await page.waitForURL(/\/library/, { timeout: 30_000 })

  await page.getByText('babelblox').first().click()
  await expect(page.getByText('continue')).toBeVisible({ timeout: 10_000 })
  await page.getByText('continue').click()
  await page.waitForTimeout(3000)

  await page.keyboard.press('Escape')
  await expect(page.getByText('resume')).toBeVisible({ timeout: 10_000 })
})
