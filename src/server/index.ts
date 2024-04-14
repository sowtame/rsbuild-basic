import Fastify from 'fastify'
import { serverRender } from './server-render'
// @ts-ignore
import fastExp from '@fastify/express'

export const startServer = async () => {
  const fastify = Fastify()
  await fastify.register(fastExp)

  console.log('read server code', new Date().toLocaleTimeString())

  fastify.get('/', (req, reply) => {
    const html = serverRender()

    reply.send(html).type('text/html')
  })

  return fastify
}
