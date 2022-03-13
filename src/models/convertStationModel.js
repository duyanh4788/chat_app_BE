const mongoose = require('mongoose');
const { TitleModel } = require('../common/common.constants');

const ConvertStationSchema = mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { versionKey: false },
);
const ConvertStation = mongoose.model(
  TitleModel.CONVERTSTATION,
  ConvertStationSchema,
);

module.exports = {
  ConvertStation,
};
