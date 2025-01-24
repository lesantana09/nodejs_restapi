import z from 'zod'
import { FastifyTypedInstance } from '../@types/types'
import { env } from '../env'

export async function AuthRoutes(app: FastifyTypedInstance) {
  const authService = app.authService
  const userService = app.userService

  app.addHook('onReady', async () => {
    await userService.save({
      clientId: env.LOGIN_CLIENTID,
      clientSecret: env.LOGIN_CLIENTSECRET,
    })
  })

  app.post(
    '/login',
    {
      schema: {
        description: 'Login to the system',
        tags: ['auth'],
        body: z.object({
          clientId: z.string().default('1234_client_id'),
          clientSecret: z.string().default('1234_client_id'),
        }),
        response: {
          201: z.object({
            accessToken: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { clientId, clientSecret } = request.body

      try {
        const accessToken = authService.login(clientId, clientSecret)
        reply.status(201).send({ accessToken })
      } catch (error) {
        let message = { message: 'Internal Server Error' }
        if (error instanceof Error) {
          message = { message: error.message }
        }
        reply.status(401).send(message)
      }
    },
  )
}
