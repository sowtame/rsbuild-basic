import Fastify from 'fastify'
import { serverRender } from './server-render'
import fastExp from '@fastify/express'
import fastWs from '@fastify/websocket'

export const startServer = async () => {
  const fastify = Fastify()

  fastify.register(fastExp)
  fastify.register(fastWs)

  console.log('read server code', new Date().toLocaleTimeString())

  fastify.get('/', (req, reply) => {
    const html = serverRender()

    return reply.header('content-type', 'text/html').send(html)
  })

  // fastify.get('/*', { websocket: true }, (socket, request) => {
  //   // @ts-ignore
  //   const sessionPromise = request.getSession() // example async session getter, called synchronously to return a promise

  //   socket.on('message', async (message) => {
  //     const session = await sessionPromise()
  //     console.log('🚀 ~ socket.on ~ session:', session)
  //     // do something with the message and session
  //   })
  // })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  // fastify.on('upgrade', rsbuildServer.onHTTPUpgrade)

  return fastify
}
