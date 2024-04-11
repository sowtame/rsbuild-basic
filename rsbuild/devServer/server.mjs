import express from 'express'
import { createRsbuild } from '@rsbuild/core'
import { loadConfig } from '@rsbuild/core'

export async function startDevServer() {
  const { content } = await loadConfig({})

  // Init Rsbuild
  const rsbuild = await createRsbuild({
    rsbuildConfig: content,
  })

  const app = express()

  // app.all('*', async (req, res, next) => {
  //   try {
  //     // const remotesPath = path.join(process.cwd(), './dist/server/index.js')
  //     // const a = await import('./../../src/server/server-render')

  //     serverRender(req, res, next)
  //   } catch (error) {
  //     console.log('🚀 ~ app.all ~ error:', error)
  //   }
  // })

  // Create Rsbuild DevServer instance
  const rsbuildServer = await rsbuild.createDevServer()

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  const httpServer = app.listen(rsbuildServer.port, async () => {
    // Notify Rsbuild that the custom server has started
    await rsbuildServer.afterListen()
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  httpServer.on('upgrade', rsbuildServer.onHTTPUpgrade)

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    },
  }
}
