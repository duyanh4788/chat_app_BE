import { UserSchemaProps } from '../common/common.interface';

export interface IFriendsDriversRepository {
  addFriend(userId: string, friendId: string): Promise<void>;
  getListFriends(userId: string): Promise<UserSchemaProps[]>;
}
