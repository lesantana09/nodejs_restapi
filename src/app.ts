import { fastify } from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'
import { AuthRoutes } from './routes/auth'
import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import AuthService from './service/auth'
import UserService from './service/user'
import InMemoryDatabase from './database_memory'

const userDatabase = new InMemoryDatabase<{
  clientId: string
  clientSecret: string
}>()
const userService = new UserService(userDatabase)
const authService = new AuthService(userService)

export const app = fastify({
  logger: false,
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.decorate('authService', authService)
app.decorate('userService', userService)

app.register(fastifyCors, { origin: '*' })
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Nodejs Rest API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(cookie)
app.register(transactionsRoutes, { prefix: 'transactions' })
app.register(AuthRoutes, { prefix: 'auth' })
