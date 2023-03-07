import * as mongoose from 'mongoose';

export interface ResponseListMessages {
  listMessages: MessagesSchemaProps[],
  totalPage: number,
  skip: number
}

export interface MessagesSchemaProps {
  conversationId: String;
  senderId: String;
  reciverId: String;
  text: String;
}

const Schema = mongoose.Schema;

export const MessagesSchema = new Schema<MessagesSchemaProps>(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
      require: true,
    },
    reciverId: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, versionKey: false },
);
