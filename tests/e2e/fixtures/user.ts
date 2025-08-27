import { test as base } from '@playwright/test'
import { attemptAsync } from 'es-toolkit'
import ky from 'ky'
import { nanoid } from 'nanoid'

interface User {
  password: string
  username: string
}

export const test = base.extend<{ user: User }>({
  user: [
    async ({ baseURL, page }, use) => {
      const user = {
        password: nanoid(),
        username: nanoid(),
      }

      const formData = new FormData()
      formData.append('username', user.username)
      formData.append('password', user.password)
      const apiUrl = new URL('api/v1/auth/register', baseURL)
      await attemptAsync(() => ky.post(apiUrl, { body: formData }))

      await use(user)
    },
    { scope: 'test' },
  ],
})
