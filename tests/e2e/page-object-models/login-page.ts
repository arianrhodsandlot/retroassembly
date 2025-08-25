import type { Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly url = 'login'

  constructor(page: Page) {
    this.page = page
  }

  async createAccount(username: string, password: string, repeatPassword: string) {
    await this.page.getByLabel('Username').fill(username)
    await this.page.getByLabel('Password').first().fill(password)
    await this.page.getByLabel('Repeat password').fill(repeatPassword)
    await this.page.getByText('Create Your Account').click()
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'load' })
  }

  async login(username: string, password: string, waitForLoaded = true) {
    await this.goto()
    await this.page.getByLabel('Username').fill(username)
    await this.page.getByLabel('Password').first().fill(password)
    await this.page.locator('button').getByText('Log in').click()
    if (waitForLoaded) {
      await this.page.waitForURL('library', { waitUntil: 'load' })
    }
  }

  async waitForLoaded() {
    await this.page.waitForURL(this.url, { waitUntil: 'load' })
  }
}
