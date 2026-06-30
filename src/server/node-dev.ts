import { Hono } from 'hono'
import { RouterContextProvider, createRequestHandler } from 'react-router'
import app from './app.ts'

const pages = new Hono()

pages.all('*', async (c) => {
  const build = await import('virtual:react-router/server-build')
  const requestHandler = createRequestHandler(build, 'development')
  return requestHandler(c.req.raw, new RouterContextProvider())
})

app.route('', pages)

export { default } from './app.ts'
