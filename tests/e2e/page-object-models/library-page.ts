import type { Page } from '@playwright/test'

export class LibraryPage {
  readonly homeURL = 'library'
  readonly page: Page
  readonly romsURL = 'library/roms'

  constructor(page: Page) {
    this.page = page
  }

  async closeSettings() {
    const { page } = this
    await page.getByTitle('close').click()
    await page.getByRole('dialog').waitFor({ state: 'detached' })
  }

  async goto() {
    await this.page.goto(this.romsURL, { waitUntil: 'load' })
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
    await this.page.getByLabel('menu').filter({ visible: true }).click()
  }

  async uploadROMs(roms: { path: string; platform: string; displayName: string }[]) {
    const { page } = this
    const romsByPlatform: Record<string, { paths: string[]; platform: string }> = {}
    for (const rom of roms) {
      const key = rom.displayName
      romsByPlatform[key] = romsByPlatform[key] || { paths: [], platform: rom.platform }
      romsByPlatform[key].paths.push(rom.path)
    }

    for (const [displayName, { paths }] of Object.entries(romsByPlatform)) {
      await this.goto()
      await page.locator('button').getByText('add').first().click()
      await page.waitForTimeout(100)
      await page.getByRole('menuitem', { exact: true, name: displayName }).click()
      await page.getByRole('dialog').waitFor({ state: 'visible' })
      const fileChooserPromise = page.waitForEvent('filechooser')
      await page.getByText('select files').click()
      const fileChooser = await fileChooserPromise
      await fileChooser.setFiles(paths)
      await page.getByRole('dialog').waitFor({ state: 'detached' })
    }
  }

  async waitForLoaded() {
    await this.page.waitForURL(this.romsURL, { waitUntil: 'load' })
  }
}
