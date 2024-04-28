import Fastify from 'fastify'
import { serverRender } from './server-render'
import middie from '@fastify/middie'

export const startServer = async () => {
  const fastify = Fastify()

  await fastify.register(middie)

  console.log('read server code', new Date().toLocaleTimeString())

  fastify.get('/', (req, reply) => {
    const html = serverRender()

    return reply.header('content-type', 'text/html').send(html)
  })

  return fastify
}
