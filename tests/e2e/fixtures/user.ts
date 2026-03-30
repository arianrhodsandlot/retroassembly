import { test as base } from '@playwright/test'
import { nanoid } from '#@/utils/server/nanoid.ts'

interface User {
  password: string
  username: string
}

export const test = base.extend<{ user: User }>({
  user: [
    async ({ baseURL }, use) => {
      const user = {
        password: nanoid(),
        username: nanoid(),
      }

      const formData = new FormData()
      formData.append('username', user.username)
      formData.append('password', user.password)
      const apiUrl = new URL('api/v1/auth/register', baseURL)
      await fetch(apiUrl, { body: formData, method: 'POST' })

      await use(user)
    },
    { scope: 'test' },
  ],
})
