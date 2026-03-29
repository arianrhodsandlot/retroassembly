import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as romsTest } from './fixtures/roms.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('search for rom by title', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)
  await library.openSearch()

  const targetRom = roms[0]
  await library.search(targetRom.title)

  await expect(page.getByText(targetRom.title, { exact: false }).first()).toBeVisible()
})

test('search with no results', async ({ page, pages: { library, login }, user }) => {
  await login.login(user)
  await library.openSearch()

  await library.search('nonexistentrom12345')

  await expect(page.getByText('No results found')).toBeVisible()
})

test('launch game from search results', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)
  await library.openSearch()

  const targetRom = roms[0]
  await library.search(targetRom.title)

  await page.getByText(targetRom.title, { exact: false }).first().click()

  await expect(page.getByText('start')).toBeVisible()
})

test('navigate search results with keyboard', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms)
  await library.openSearch()

  await library.search('a')

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')

  await page.waitForURL(/\/library\/platform\/.*\/rom\/.*/, { timeout: 5000 })
})
