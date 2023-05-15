import mongoose from 'mongoose';
import { TitleModel } from '../common/common.constants';
import { IFriendsDriversRepository } from '../Repository/IFriendsDriversRepository';
import { FriendsSchema } from '../models/FriendsModel';
import { FriendsSchemaProps, UserSchemaProps } from '../common/common.interface';

export class FriendsDriversController implements IFriendsDriversRepository {
  private Friends = mongoose.model(TitleModel.FRIENDS, FriendsSchema);

  async addFriend(userId: string, friendId: string): Promise<void> {
    const newFriend = new this.Friends({ userId, friendId });
    await newFriend.save();
    const yourFriend = new this.Friends({ userId: friendId, friendId: userId });
    await yourFriend.save();
    return;
  }

  async getListFriends(userId: string): Promise<UserSchemaProps[]> {
    const usersAndFriends = await this.Friends.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'friendId',
          foreignField: '_id',
          as: 'friend'
        }
      },
      { $unwind: '$friend' },
      {
        $project: {
          _id: 1,
          account: '$friend.account',
          fullName: '$friend.fullName',
          avatar: '$friend.avatar',
          isOnline: '$friend.isOnline',
          userId: '$friend._id',
          isFriend: 1,
          createdAt: 1
        }
      }
    ]);
    return usersAndFriends;
  }

  async findUserIdFriendId(userId: string, friendId: string): Promise<UserSchemaProps> {
    const user = await this.Friends.findOne({ userId, friendId });
    return this.transFromData(user);
  }

  async findById(id: string): Promise<FriendsSchemaProps> {
    const user = await this.Friends.findById(id);
    return this.transFromData(user);
  }

  async acceptFriends(id: string): Promise<void> {
    await this.Friends.findByIdAndUpdate(id, {
      isFriend: true
    });
    return;
  }

  async declineFriends(id: string, userId: string, friendId: string): Promise<void> {
    await this.Friends.findByIdAndRemove(id);
    await this.Friends.findOneAndDelete({ friendId: userId, userId: friendId });
    return;
  }

  private transFromData(data: any) {
    if (!data) return;
    return data._doc;
  }
}
