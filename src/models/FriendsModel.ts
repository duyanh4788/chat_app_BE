import * as mongoose from 'mongoose';
import { FriendsSchemaProps } from '../common/common.interface';

const Schema = mongoose.Schema;

export const FriendsSchema = new Schema<FriendsSchemaProps>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true
    },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      unique: true
    },
    isFriend: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, versionKey: false }
);
