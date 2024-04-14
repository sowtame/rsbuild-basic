import express from 'express'
import path from 'path'
import { createRsbuild } from '@rsbuild/core'
import { loadConfig } from '@rsbuild/core'

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

  await wait()

  const remotesPath = path.join(process.cwd(), './dist/server/index.js')

  const importedApp = await import(remotesPath)

  const app = importedApp.default.default

  // app.all('*', async (req, res, next) => {
  //   try {
  //     res.setHeader('Content-type', 'text/html')
  //     res.write('<!DOCTYPE html>')
  //     res.write('<html>')

  //     res.write(`<div id="root">${1}</div>`)
  //     res.write('</body></html>')
  //     res.send()

  //     next()
  //   } catch (error) {
  //     console.log('🚀 ~ app.all ~ error:', error)
  //   }
  // })

  // Apply Rsbuild’s built-in middlewares
  app.use(rsbuildServer.middlewares)

  const httpServer = app.listen(rsbuildServer.port, async () => {
    // Notify Rsbuild that the custom server has started
    await rsbuildServer.afterListen()
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  httpServer.on('upgrade', (...params) => {
    rsbuildServer.onHTTPUpgrade(params)
  })

  return {
    close: async () => {
      await rsbuildServer.close()
      httpServer.close()
    },
  }
}
