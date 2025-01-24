import z from 'zod'
import { FastifyTypedInstance } from '../@types/types'
import AuthService from '../service/auth_service'

export async function AuthRoutes(app: FastifyTypedInstance) {
  app.post(
    '/login',
    {
      schema: {
        description: 'Login to the system',
        tags: ['auth'],
        body: z.object({
          client_id: z.string(),
          client_secret: z.string(),
        }),
        response: {
          201: z.object({
            access_token: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { client_id, client_secret } = request.body

      try {
        const access_token = new AuthService().login(client_id, client_secret)
        reply.status(201).send({ access_token })
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
