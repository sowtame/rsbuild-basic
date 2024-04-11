import express from 'express'
import { serverRender } from './server-render'

const app = express()
console.log(1)
// const PORT = 8080

app.all('/', async (req, res, next) => {
  try {
    serverRender(req, res, next)
  } catch (error) {
    console.log('🚀 ~ app.all ~ error:', error)
  }
})

// app.listen(PORT, () => {
//   console.info(`[${new Date().toISOString()}]`, `App2 is running: 🌎 http://localhost:${PORT}`)
// })

export default app
