import jwt from 'jsonwebtoken'
import { env } from '../env'

class AuthService {

  login(client_id: string, client_secret: string) {
    const user = {
      client_id,
      client_secret,
    }

    if (
      client_id != env.LOGIN_CLIENT_ID &&
      client_secret != env.LOGIN_CLIENT_SECRET
    ) {
      throw new Error('Invalid credentials')
    }
    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: '1h' })

    return token
  }

  verifyToken(access_token: string) {

  }
}

export default AuthService
