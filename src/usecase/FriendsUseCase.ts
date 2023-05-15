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

  async findUserIdFriendId(userId: string, friendId: string) {
    return await this.friendsDriversRepository.findUserIdFriendId(userId, friendId);
  }

  async acceptFriends(friendId: string) {
    return await this.friendsDriversRepository.acceptFriends(friendId);
  }

  async declineFriends(id: string, userId: string, friendId: string) {
    return await this.friendsDriversRepository.declineFriends(id, userId, friendId);
  }

  async findFriendById(id: string) {
    return await this.friendsDriversRepository.findById(id);
  }
}
