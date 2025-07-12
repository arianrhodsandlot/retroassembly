import ky from 'ky'

export const http = ky.create({
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (response.ok) {
          return response
        }

        let error = response
        try {
          error = await response.json()
        } catch {}
        throw error
      },
    ],
  },
})

export const api = http.extend({
  prefixUrl: '/api/v1/',
})
