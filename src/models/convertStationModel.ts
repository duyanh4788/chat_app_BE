import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ConvertStationSchema = new Schema(
  {
    members: {
      type: Array
    }
  },
  { versionKey: false }
);
