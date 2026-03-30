import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from '../fixtures/pages.ts'
import { test as romsTest } from '../fixtures/roms.ts'
import { test as userTest } from '../fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('create manual save state during gameplay', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.slice(0, 1))

  await page.getByText('babelblox').click()
  await page.getByText('start').click()
  await page.locator('#canvas').waitFor()
  await page.getByTitle('pause').waitFor({ state: 'detached' })

  await page.keyboard.press('Escape')
  await page.getByText('save state').click()

  await expect(page.locator('.game-state')).toHaveCount(1)

  await page.getByText('save & exit').click()
  await page.locator('#canvas').waitFor({ state: 'detached' })

  await page.getByText('continue').click()
  await page.locator('#canvas').waitFor()
  await page.getByTitle('pause').waitFor({ state: 'detached' })

  await page.keyboard.press('Escape')
  await expect(page.locator('.game-state')).toHaveCount(2)
})
