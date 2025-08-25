import type { Page } from '@playwright/test'

export class LibraryPage {
  readonly page: Page
  readonly url = 'library'

  constructor(page: Page) {
    this.page = page
  }

  async closeSettings() {
    await this.page.getByTitle('Close').click()
    await this.page.getByRole('dialog').waitFor({ state: 'detached' })
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'load' })
  }

  async gotoSettingsTab(tab: string) {
    await this.openMenu()
    await this.page.getByText('Setting').click()
    await this.page.getByText(tab).first().click()
  }

  async logout() {
    await this.openMenu()
    await this.page.getByText('Log out').click()
    await this.page.locator('button').getByText('Log out').click()
  }

  async openMenu() {
    await this.page.getByTitle('Menu').click()
  }

  async waitForLoaded() {
    await this.page.waitForURL(this.url, { waitUntil: 'load' })
  }
}
