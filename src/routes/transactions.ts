import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check_session_id_exists'
import { FastifyTypedInstance } from '../@types/types'

export async function transactionsRoutes(app: FastifyTypedInstance) {
  app.addHook('preHandler', async (request, reply) => {
    if (!request.method) {
      checkSessionIdExists(request, reply)
    }
  })

  app.get(
    '/',
    {
      schema: {
        description: 'List transactions',
        tags: ['transactions'],
      },
    },
    async (request) => {
      const { sessionId } = request.cookies
      const transactions = await knex('transactions')
        .select('*')
        .where('session_id', sessionId)
      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      schema: {
        description: 'Get transaction',
        tags: ['transactions'],
      },
    },
    async (request, reply) => {
      const getTransactionSchema = z.object({
        id: z.string().uuid(),
      })

      const { sessionId } = request.cookies
      const { id } = getTransactionSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({ id, session_id: sessionId })
        .first()
      if (!transaction) {
        return reply.status(404).send()
      }
      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      schema: {
        description: 'Get User summary of transaction',
        tags: ['transactions'],
      },
    },
    async (request) => {
      const { sessionId } = request.cookies
      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'total' })
        .first()
      return { summary }
    },
  )

  app.post(
    '/',
    {
      schema: {
        description: 'Create a new transaction',
        tags: ['transactions'],
        body: z.object({
          title: z.string().default('Minha Despesa'),
          amount: z.number().default(100),
          type: z.enum(['credit', 'debit']).default('debit'),
        }),
        response: {
          201: z.null().describe('User created successfully'),
        },
      },
    },
    async (request, reply) => {
      const { title, amount, type } = request.body

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()
        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('transactions').insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
        session_id: sessionId,
      })
      return reply.status(201).send()
    },
  )
}
