import * as mongoose from 'mongoose';
import { UsersSchema } from './userModel';

const Schema = mongoose.Schema;

export const RoomSchema = new Schema({
  listUser: [UsersSchema]
});
