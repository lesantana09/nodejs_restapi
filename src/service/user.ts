import InMemoryDatabase from "../database_memory";

export interface UserInterface {
    client_id: string;
    client_secret: string;
  }
  
  class UserService {
    private db: InMemoryDatabase<UserInterface>;

    constructor(db: InMemoryDatabase<UserInterface>) {
      this.db = db;
    }
  
    save(user: UserInterface) {
      this.db.create(user.client_id, user);
    }
  
    getUserByClientId(client_id: string): UserInterface {
      const user = this.db.read(client_id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;

    }
  }
  
  export default UserService;
  