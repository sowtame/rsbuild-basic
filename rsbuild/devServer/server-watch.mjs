// import express, { Express } from 'express'
import path from 'path'
import { createRsbuild } from '@rsbuild/core'
import { loadConfig } from '@rsbuild/core'
import chokidar from 'chokidar'

import { createRequire } from 'module'

const serverPath = path.join(process.cwd(), './dist/server/index.js')
const serverdiRPath = path.join(process.cwd(), './dist/server/index.js')

const require = createRequire(import.meta.url)

let app
let httpServerClosing = false

const loadServerApp = async () => {
  delete require.cache[serverPath]

  const importedApp = await require(serverPath)

  return importedApp.startServer()
}

const startCustomDevServer = async ({ rsbuildServer }) => {
  if (app) {
    console.log('closing http server')
    httpServerClosing = true
    await app.close()
    console.log('closed http server')
    app = undefined
    httpServerClosing = false
  }

  app = await loadServerApp()

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  console.log('start server')

  app.listen({ port: rsbuildServer.port }, async () => {
    console.log('ready express server')

    // Notify Rsbuild that the custom server has started
    await rsbuildServer.afterListen()
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  // app.on('upgrade', rsbuildServer.onHTTPUpgrade)
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
      app.close()
    },
  }
}
