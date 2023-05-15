import { FriendsSchemaProps, UserSchemaProps } from '../common/common.interface';

export interface IFriendsDriversRepository {
  addFriend(userId: string, friendId: string): Promise<void>;
  acceptFriends(friendId: string): Promise<void>;
  declineFriends(id: string, userId: string, friendId: string): Promise<void>;
  findUserIdFriendId(userId: string, friendId: string): Promise<UserSchemaProps>;
  findById(id: string): Promise<FriendsSchemaProps>;
  getListFriends(userId: string): Promise<UserSchemaProps[]>;
}
