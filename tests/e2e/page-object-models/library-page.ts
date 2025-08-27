import type { Page } from '@playwright/test'

export class LibraryPage {
  readonly page: Page
  readonly url = 'library'

  constructor(page: Page) {
    this.page = page
  }

  async closeSettings() {
    const { page } = this
    await page.getByTitle('close').click()
    await page.getByRole('dialog').waitFor({ state: 'detached' })
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'load' })
  }

  async gotoSettingsTab(tab: string) {
    const { page } = this
    await this.openMenu()
    await page.getByText('setting').click()
    await page.getByText(tab).first().click()
  }

  async logout() {
    const { page } = this
    await this.openMenu()
    await page.getByText('log out').click()
    await page.locator('button').getByText('log out').click()
  }

  async openMenu() {
    await this.page.getByLabel('menu').click()
  }

  async uploadROMs(roms: string[]) {
    const { page } = this
    await page.locator('button').getByText('add').first().click()
    await page.getByRole('menuitem').getByText('NES', { exact: true }).click()
    await page.getByRole('dialog').waitFor({ state: 'visible' })
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('select files').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(roms)
    await page.getByRole('dialog').waitFor({ state: 'detached' })
  }

  async waitForLoaded() {
    await this.page.waitForURL(this.url, { waitUntil: 'load' })
  }
}
