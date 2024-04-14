import express, { Request, Response } from 'express'
import { serverRender } from './server-render'

export const startServer = () => {
  const app = express()

  console.log('read server time', new Date().toLocaleTimeString())

  app.get('/', async (req: Request, res: Response) => {
    return res.send(`date test 3`)
    // try {
    //   return serverRender(req, res)
    // } catch (error: any) {
    //   console.log('🚀 ~ app.all ~ error:', error?.message)
    //   // res.status(200).send(error?.message)
    //   // console.log('🚀 ~ app.all ~ error:', error)
    // }
  })

  return app
}
