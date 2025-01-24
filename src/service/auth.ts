import jwt from 'jsonwebtoken'
import { env } from '../env'
import UserService from './user';

class AuthService {

  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  login(client_id: string, client_secret: string) {

    const user = this.userService.getUserByClientId(client_id);

    if (client_secret !== user.client_secret && client_secret !== user.client_secret) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(user, env.JWT_SECRET, { expiresIn: '10m' });
    return token;
  }

  verifyToken(token: string) {
    const decodedToken: any = jwt.verify(token, env.JWT_SECRET);
    try {
      const user = this.userService.getUserByClientId(decodedToken.client_id);
      if (!user) {
        throw new Error('Invalid token');
      }
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default AuthService
