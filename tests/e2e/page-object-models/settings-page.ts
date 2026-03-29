import type { Page } from '@playwright/test'

export class SettingsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.getByLabel('menu').filter({ visible: true }).click()
    await this.page.getByText('setting').click()
    await this.page.getByRole('dialog').waitFor({ state: 'visible' })
  }

  async close() {
    await this.page.getByTitle('close').click()
    await this.page.getByRole('dialog').waitFor({ state: 'detached' })
  }

  async switchTab(tabName: 'library' | 'inputs' | 'emulating' | 'general') {
    await this.page.getByRole('tab', { name: tabName }).click()
  }

  async changeDisplayName(name: string) {
    await this.page.getByLabel('display name').fill(name)
  }

  async getDisplayName() {
    return this.page.getByLabel('display name').inputValue()
  }

  async toggleBilinearFiltering() {
    const switch_ = this.page.getByRole('switch', { name: /bilinear filtering/i })
    await switch_.click()
    await this.page.waitForTimeout(500)
  }

  async isBilinearFilteringEnabled() {
    const switch_ = this.page.getByRole('switch', { name: /bilinear filtering/i })
    const checked = await switch_.getAttribute('aria-checked')
    return checked === 'true'
  }

  async toggleFullscreenOnLaunch() {
    await this.page.getByRole('switch', { name: /fullscreen on launch/i }).click()
  }

  async resetAllSettings() {
    await this.page.getByText('reset all settings').click()
    await this.page.getByRole('button').getByText('reset').click()
  }
}
