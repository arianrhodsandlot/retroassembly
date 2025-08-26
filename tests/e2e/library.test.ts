import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as romsTest } from './fixtures/roms.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('upload roms', async ({ page, pages, roms, user }) => {
  await pages.login.login(user.username, user.password)

  await pages.library.uploadROMs(roms.map(({ path }) => path))
  await Promise.all(roms.map(({ title }) => expect(page.getByText(title)).toHaveCount(1)))
})

test('delete roms', async ({ page, pages, roms, user }) => {
  await pages.login.login(user.username, user.password)

  await pages.library.uploadROMs(roms.map(({ path }) => path))
  await page.locator('_react=GameEntryDropdownMenu').first().click()
  await page.getByText('delete the rom').click()
  await page.locator('button').getByText('delete').click()

  await expect(page.getByText(roms[0].title)).toHaveCount(0)
  await expect(page.getByText(roms[1].title)).toHaveCount(1)
})
