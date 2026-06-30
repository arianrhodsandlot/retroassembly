import { Hono } from 'hono'
import { RouterContextProvider, createRequestHandler } from 'react-router'
import app from './app.ts'

const pages = new Hono()
const requestHandler = createRequestHandler(() => import('virtual:react-router/server-build'), import.meta.env.MODE)
pages.all('*', (c) => requestHandler(c.req.raw, new RouterContextProvider()))

app.route('', pages)

export { default } from './app.ts'
