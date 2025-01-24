import 'fastify'
import AuthService from './service/auth'
import UserService from './service/user'

declare module 'fastify' {
  interface FastifyInstance {
    authService: AuthService
    userService: UserService
  }
}
