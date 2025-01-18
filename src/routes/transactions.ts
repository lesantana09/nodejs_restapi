import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middlewares/check_session_id_exists'

export async function transactionsRoutes(app: FastifyInstance) {

  app.addHook('preHandler', async (request, reply) => {
    if (!request.method){
    checkSessionIdExists(request, reply)
  }
})

app.get(
  '/',
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
  async (request) => {
    const { sessionId } = request.cookies
    const summary = await knex('transactions')
      .where('session_id', sessionId)
      .sum('amount', { as: 'total' })
      .first()
    return { summary }
  },
)

app.post('/', async (request, reply) => {
  const createTransactionSchema = z.object({
    title: z.string(),
    amount: z.number(),
    type: z.enum(['credit', 'debit']),
  })

  const { title, amount, type } = createTransactionSchema.parse(request.body)

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
})
}
