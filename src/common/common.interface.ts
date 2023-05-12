import { StatusCreate, Type2FA, UserTypeCreate } from './common.enum';

export interface UserRequest {
  _id: string;
  account: string;
  exp: number;
  iat: number;
  userTypeCode: string;
}

export interface InfoUser {
  socketId: string;
  _id: string;
  account: string;
  fullName: string;
  email: string;
  avatar: string;
  isOnline: boolean;
}

export interface DataMessages {
  conversationId: string;
  senderId: string;
  reciverId: string;
  text: string;
}

export interface UserSchemaProps {
  _id?: String;
  account?: String;
  passWord?: String;
  fullName?: String;
  email?: String;
  avatar?: String;
  isOnline?: Boolean;
  statusCreate?: StatusCreate;
  twofa?: boolean;
  isFriend?: Boolean;
  type2FA?: Type2FA;
  userTypeCode?: String;
  userTypeCreate?: UserTypeCreate;
  userTypeCreateId?: String;
}

export interface FriendsSchemaProps {
  _id?: String;
  userId?: String;
  friendId?: String;
  isFriend?: Boolean;
}

export interface ResponseListMessages {
  listMessages: MessagesSchemaProps[];
  totalPage: number;
  skip: number;
}

export interface MessagesSchemaProps {
  conversationId: String;
  senderId: String;
  reciverId: String;
  text: any;
}

export interface AuthenticatorSchemaProps {
  userId: String;
  dateTimeCreate: Date;
  authCode: String;
}

export interface AuthenticatorAppSchemaProps {
  userId: String;
  dateTimeCreate: Date;
  authKey: String;
}
