import Fastify from 'fastify'
import { serverRender } from './server-render'
import fastExp from '@fastify/express'

export const startServer = async () => {
  const fastify = Fastify()

  fastify.register(fastExp)

  console.log('read server code', new Date().toLocaleTimeString())

  fastify.get('/', (req, reply) => {
    const html = serverRender()

    return reply.header('content-type', 'text/html').send(html)
  })

  // Subscribe to the server's http upgrade event to handle WebSocket upgrades
  // fastify.on('upgrade', rsbuildServer.onHTTPUpgrade)

  return fastify
}
