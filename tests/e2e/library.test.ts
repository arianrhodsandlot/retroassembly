import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from './fixtures/pages.ts'
import { test as romsTest } from './fixtures/roms.ts'
import { test as userTest } from './fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

test('upload roms', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.map(({ path }) => path))

  await Promise.all(roms.map(({ title }) => expect(page.getByText(title)).toHaveCount(1)))
})

test('delete roms', async ({ page, pages: { library, login }, roms, user }) => {
  await login.login(user)
  await library.uploadROMs(roms.map(({ path }) => path))

  await page.getByRole('main').getByLabel('menu').first().click()
  await page.getByText('delete the rom').click()
  await page.getByRole('button').getByText('delete').click()

  await Promise.all([
    expect(page.getByText(roms[0].title)).toHaveCount(0),
    expect(page.getByText(roms[1].title)).toHaveCount(1),
  ])
})

test('delete multiple roms', async ({ page, pages: { library, login }, roms, user }) => {
  const main = page.getByRole('main')
  const dialog = page.getByRole('alertdialog')
  const checkboxes = main.getByRole('checkbox')

  await login.login(user)
  await library.uploadROMs(roms.map(({ path }) => path))

  await main.getByLabel('menu').first().click()
  await page.getByRole('menuitem').getByText('select').click()
  await Promise.all([expect(checkboxes.first()).toBeChecked(), expect(checkboxes.last()).not.toBeChecked()])

  await checkboxes.last().click()
  await page.getByText('delete selected').click()
  await dialog.getByRole('button').getByText('delete').click()
  await Promise.all(roms.map(({ title }) => expect(page.getByText(title)).toHaveCount(0)))
})

test('update metadata', async ({ page, pages: { library, login }, roms, user }) => {
  const main = page.getByRole('main')
  const testMetadata = [
    { label: 'released', value: '2000-01-01' },
    { label: 'genres', value: 'test genre' },
    { label: 'players', value: '5' },
    { label: 'developer', value: 'test developer' },
    { label: 'publisher', value: 'test publisher' },
    { label: 'description', value: 'test description' },
  ]

  await login.login(user)
  await library.uploadROMs(roms.map(({ path }) => path))
  await page.locator('.game-entry').first().click()
  await page.getByLabel('edit metadata').first().click()
  for (const { label, value } of testMetadata) {
    if (label === 'players') {
      await page.getByLabel(label).click()
      await page.getByRole('option', { name: '8' }).click()
    } else {
      await page.getByLabel(label).fill(value)
    }
  }
  await page.getByText('save').click()
  await Promise.all(testMetadata.map(({ value }) => expect(main).toContainText(value)))
})
