import { createQueryBuilder, Repository } from "typeorm";
import User, { iUserMinimum, iUserReturnMinimum } from "../models/user";

/**
 * Contains error information about a user
 */
export class UserError extends Error {
  user?: User;

  constructor(options: { message: string; user?: User }) {
    const { message, user } = options;
    super(message);
    this.user = user;
  }
}

export class UserServices {
  private userRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.userRepository = usersRepository;
  }

  /**
   * Get all users in the database
   */
  async getAllUsers(): Promise<iUserReturnMinimum[]> {
    const users = await this.userRepository.find();
    if (!users || users.length < 1) {
      throw new UserError({ message: "There are no users in the database" });
    }

    return users.map((user) => {
      return {
        createdAt: user.createdAt,
        email: user.email,
        updatedAt: user.createdAt,
        id: user.id,
        username: user.username,
      };
    });
  }

  /**
   * get a user by id. Throws UserError if user does not exist
   * @param {number} id The userId for the user to find
   * @returns A promise containing a User object
   */
  async getUserById(id: number): Promise<iUserReturnMinimum> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new UserError({ message: `User with id ${id} not found` });
    }
    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      updatedAt: user.updatedAt,
      username: user.username,
    };
  }

  /**
   * Creates a new user if one does not exist in the database -
   * throws a UserError if a user already exists by that name
   * @param user The user to create in the database
   */
  async createNewUser(user: iUserMinimum) {
    const dbUser = await this.userRepository
      .createQueryBuilder("User")
      .where({ username: user.username })
      .getOne();

    if (dbUser) {
      throw new UserError({
        message: `username ${user.username} already exists`,
        user: dbUser,
      });
    }

    await this.userRepository.insert(user);
  }

  /**
   * Deletes a user from the database. Throws a UserError if there is an issue
   * @param id The id for the user to delete
   */
  async deleteUserById(id: number) {
    await this.userRepository.delete(id);
  }

  /**
   * Updates a user by id
   * @param user The new information for the user to update
   * @param id The userid for the user to update
   */
  async updateUser(
    id: number,
    user: iUserMinimum
  ): Promise<iUserReturnMinimum> {
    // Check if the user exists in the database
    await this.getUserById(id);

    await this.userRepository.update(id, user);
    return await this.getUserById(id);
  }
}
