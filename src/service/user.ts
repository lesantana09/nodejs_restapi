import InMemoryDatabase from '../database_memory'

export interface UserInterface {
  clientId: string
  clientSecret: string
}

class UserService {
  private db: InMemoryDatabase<UserInterface>

  constructor(db: InMemoryDatabase<UserInterface>) {
    this.db = db
  }

  save(user: UserInterface) {
    this.db.create(user.clientId, user)
  }

  getUserByClientId(clientId: string): UserInterface {
    const user = this.db.read(clientId)
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }
}

export default UserService
