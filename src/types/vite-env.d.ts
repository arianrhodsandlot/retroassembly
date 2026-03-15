/// <reference types="vite-plus/client" />

declare module 'virtual:react-router/server-build' {
  import type { ServerBuild } from 'react-router'

  const serverBuild: ServerBuild
  export = serverBuild
}
