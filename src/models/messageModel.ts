import * as mongoose from 'mongoose';
import { MessagesSchemaProps } from '../common/common.interface';

const Schema = mongoose.Schema;

export const MessagesSchema = new Schema<MessagesSchemaProps>(
  {
    conversationId: {
      type: String
    },
    senderId: {
      type: String,
      require: true
    },
    reciverId: {
      type: String,
      require: true
    },
    text: {
      type: Schema.Types.Mixed,
      require: true
    }
  },
  { timestamps: true, versionKey: false }
);
