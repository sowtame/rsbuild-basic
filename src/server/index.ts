import express, { Request, Response } from 'express'
import { serverRender } from './server-render'

export const startServer = async () => {
  const app = express()

  console.log('read server code', new Date().toLocaleTimeString())

  app.get('/', async (req: Request, res: Response) => {
    const html = serverRender()

    res.setHeader('content-type', 'text/html')

    return res.send(html)
  })

  return app
}
