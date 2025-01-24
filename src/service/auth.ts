import jwt from 'jsonwebtoken'
import { env } from '../env'
import UserService from './user'

interface TokenPayload {
  clientId: string
}

class AuthService {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  login(clientId: string, clientSecret: string) {
    const user = this.userService.getUserByClientId(clientId)
    if (clientSecret !== user.clientId && clientSecret !== user.clientSecret) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: '10m' })
    return token
  }

  verifyToken(token: string) {
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as TokenPayload
    try {
      const user = this.userService.getUserByClientId(decodedToken.clientId)
      if (!user) {
        throw new Error('Invalid token')
      }
    } catch (error) {
      throw new Error(`Invalid token: ${error}`)
    }
  }
}

export default AuthService
