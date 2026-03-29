import { test as base } from '@playwright/test'
import { LibraryPage } from '../page-object-models/library-page.ts'
import { LoginPage } from '../page-object-models/login-page.ts'
import { SettingsPage } from '../page-object-models/settings-page.ts'

interface Pages {
  library: LibraryPage
  login: LoginPage
  settings: SettingsPage
}

export const test = base.extend<{ pages: Pages }>({
  async pages({ page }, use) {
    const library = new LibraryPage(page)
    const login = new LoginPage(page)
    const settings = new SettingsPage(page)
    const pages = { library, login, settings }
    await use(pages)
  },
})
