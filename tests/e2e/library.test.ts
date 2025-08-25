import { mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(userTest, pagesTest)

test('upload ROMs', async ({ page, pages, user }) => {
  await pages.login.login(user.username, user.password)

  await page.locator('button').getByText('Add').first().click()
  await page.getByRole('menuitem').getByText('NES', { exact: true }).click()
  await page.getByText('select files').click()
})
