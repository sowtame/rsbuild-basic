// import express, { Express } from 'express'
import path from 'path'
import { createRsbuild } from '@rsbuild/core'
import { loadConfig } from '@rsbuild/core'
import chokidar from 'chokidar'

import { createRequire } from 'module'

const serverPath = path.join(process.cwd(), './dist/server/index.js')
const serverdiRPath = path.join(process.cwd(), './dist/server/index.js')

const require = createRequire(import.meta.url)

let httpServer
let httpServerClosing = false

const closeServer = (server) =>
  new Promise((res) => {
    server.close(() => {
      console.log('close http server')
      res('')
    })
  })

const loadServerApp = async () => {
  delete require.cache[serverPath]

  const importedApp = await require(serverPath)

  return importedApp.startServer()
}

const startCustomDevServer = async ({ rsbuildServer }) => {
  if (httpServer) {
    console.log('closing http server')
    httpServerClosing = true
    await closeServer(httpServer)
    httpServer = undefined
    httpServerClosing = false
  }

  const app = await loadServerApp()

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  console.log('start server')

  httpServer = app.listen(rsbuildServer.port, async () => {
    console.log('ready express server')

    // Notify Rsbuild that the custom server has started
    await rsbuildServer.afterListen()
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  httpServer.on('upgrade', rsbuildServer.onHTTPUpgrade)
}

export async function startDevServer() {
  const { content } = await loadConfig({})

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  })

  // Create Rsbuild DevServer instance
  const rsbuildServer = await rsbuild.createDevServer()

  rsbuild.onDevCompileDone(async ({ isFirstCompile }) => {
    if (isFirstCompile) {
      chokidar.watch(serverdiRPath).on('all', (evt, name) => {
        if (!httpServerClosing) {
          startCustomDevServer({ rsbuildServer })
        }
      })
    }
  })

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    },
  }
}
