import type { Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly url = 'login'

  constructor(page: Page) {
    this.page = page
  }

  async createAccount(username: string, password: string, repeatPassword: string) {
    await this.page.getByLabel('username').fill(username)
    await this.page.getByLabel('password').first().fill(password)
    await this.page.getByLabel('repeat password').fill(repeatPassword)
    await this.page.getByText('create your account').click()
  }

  async goto() {
    await this.page.goto(this.url, { waitUntil: 'load' })
  }

  async login(user: { password: string; username: string }, waitForLoaded = true) {
    await this.goto()
    await this.page.getByLabel('username').fill(user.username)
    await this.page.getByLabel('password').first().fill(user.password)
    await this.page.locator('button').getByText('log in').click()
    if (waitForLoaded) {
      await this.page.waitForURL('library', { waitUntil: 'load' })
    }
  }

  async waitForLoaded() {
    await this.page.waitForURL(this.url, { waitUntil: 'load' })
  }
}
