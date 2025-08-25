/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test'
import { LibraryPage } from '../page-object-models/library-page.ts'
import { LoginPage } from '../page-object-models/login-page.ts'

interface Pages {
  library: LibraryPage
  login: LoginPage
}

export const test = base.extend<{ pages: Pages }>({
  async pages({ page }, use) {
    const library = new LibraryPage(page)
    const login = new LoginPage(page)
    const pages = { library, login }
    await use(pages)
  },
})
