import express from 'express'
import path from 'path'
import { createRsbuild } from '@rsbuild/core'
import { loadConfig } from '@rsbuild/core'
import chokidar from 'chokidar'

const serverPath = path.join(process.cwd(), './dist/server/index.js')
const serverdiRPath = path.join(process.cwd(), './dist/server/index.js')

let httpServer

const loadServerApp = async () => {
  const importedApp = await import(serverPath)

  return importedApp.default.default
}

const startCustomDevServer = async ({ rsbuildServer }) => {
  if (httpServer) {
    console.log(1)
    httpServer.close()
  }

  const app = await loadServerApp()

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  httpServer = app.listen(rsbuildServer.port, async () => {
    // Notify Rsbuild that the custom server has started
    await rsbuildServer.afterListen()
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  httpServer.on('upgrade', rsbuildServer.onHTTPUpgrade)
}

const wait = () =>
  new Promise((res) => {
    setTimeout(() => {
      res()
    }, 2500)
  })

export async function startDevServer() {
  const { content } = await loadConfig({})

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  })

  // Create Rsbuild DevServer instance
  const rsbuildServer = await rsbuild.createDevServer()

  const startCustomDevServerWithRsBuild = () => startCustomDevServer({ rsbuildServer })

  chokidar.watch(serverdiRPath, { ignoreInitial: true }).on('change', (evt, name) => {
    startCustomDevServerWithRsBuild()
  })
  // chokidar.watch(serverdiRPath).on('change', async (evt, name) => {
  //   console.log('🚀 ~ watch ~ name:', name)
  //   startCustomDevServerWithRsBuild()
  // })

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    },
  }
}
