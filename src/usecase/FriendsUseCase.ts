import { IFriendsDriversRepository } from '../Repository/IFriendsDriversRepository';
import { IUserDriversRepository } from '../Repository/IUserDriversRepository';

export class FriendsUseCase {
  constructor(private friendsDriversRepository: IFriendsDriversRepository, private userDriversRepository: IUserDriversRepository) {}

  async addFriends(userId: string, friendId: string) {
    return await this.friendsDriversRepository.addFriend(userId, friendId);
  }

  async getListFriends(userId: string) {
    return await this.friendsDriversRepository.getListFriends(userId);
  }
}
