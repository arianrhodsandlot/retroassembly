/* eslint-disable react-hooks/rules-of-hooks, sonarjs/no-hardcoded-passwords */
import { test as base } from '@playwright/test'
import { attemptAsync } from 'es-toolkit'
import { uniqueId } from 'es-toolkit/compat'
import ky from 'ky'
import { LibraryPage } from '../page-object-models/library-page.ts'
import { LoginPage } from '../page-object-models/login-page.ts'

interface User {
  password: string
  username: string
}

interface Pages {
  library: LibraryPage
  login: LoginPage
}

export const test = base.extend<{
  pages: Pages
  user: User
}>({
  pages({ page }, use) {
    const library = new LibraryPage(page)
    const login = new LoginPage(page)
    const pages = { library, login }
    use(pages)
  },

  async user({ baseURL, page }, use) {
    const user = {
      password: 'testpassword',
      username: uniqueId('testuser'),
    }

    const formData = new FormData()
    formData.append('username', user.username)
    formData.append('password', user.password)
    const apiUrl = new URL('api/v1/auth/register', baseURL)
    await attemptAsync(() => ky.post(apiUrl, { body: formData }))

    await use(user)
  },
})
