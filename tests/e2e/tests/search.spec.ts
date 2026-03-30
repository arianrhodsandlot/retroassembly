import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from '../fixtures/pages.ts'
import { test as romsTest } from '../fixtures/roms.ts'
import { test as userTest } from '../fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('search for rom by title', async ({ page, pages: { library, login }, roms, user }) => {
  const textbox = page.getByRole('textbox')
  await login.login(user)
  await library.uploadROMs(roms)
  await page.getByLabel('search').click()
  const [rom] = roms
  await textbox.fill(rom.title)
  await expect(page.getByRole('list').getByText(rom.title)).toBeVisible()
})

test('search with no results', async ({ page, pages: { login }, user }) => {
  const textbox = page.getByRole('textbox')
  await login.login(user)
  await page.getByLabel('search').click()
  await textbox.fill('nonexistentrom12345')
  await expect(page.getByText('No results found')).toBeVisible()
})

test('launch game from search results', async ({ page, pages: { library, login }, roms, user }) => {
  const textbox = page.getByRole('textbox')
  await login.login(user)
  await library.uploadROMs(roms)
  await page.getByLabel('search').click()
  const [rom] = roms
  await textbox.fill(rom.title)
  await page.getByRole('list').getByText(rom.title).click()
  await expect(page.getByText('start')).toBeVisible()
})

test('navigate search results with keyboard', async ({ page, pages: { library, login }, roms, user }) => {
  const textbox = page.getByRole('textbox')
  await login.login(user)
  await library.uploadROMs(roms)
  await page.getByLabel('search').click()
  await textbox.fill('a')
  await textbox.press('ArrowDown', { delay: 200 })
  await textbox.press('ArrowDown', { delay: 200 })
  await textbox.press('Enter')
  await page.getByText('start').waitFor()
})
