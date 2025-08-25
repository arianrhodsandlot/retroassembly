import type { Page } from '@playwright/test'

export class LoginPage {
  readonly page: Page

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
    await this.page.goto('/login')
  }

  async login(username: string, password: string) {
    await this.goto()
    await this.page.getByLabel('Username').fill(username)
    await this.page.getByLabel('Password').first().fill(password)
    await this.page.locator('button').getByText('Log in').click()
  }
}
