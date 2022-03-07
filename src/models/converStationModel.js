const mongoose = require("mongoose");
const { TitleModel } = require("../common/common.constants");

const ConverStationSchema = mongoose.Schema({
  members: {
    type: Array,
  },
});
const ConverStation = mongoose.model(
  TitleModel.CONVERSTATION,
  ConverStationSchema
);

module.exports = {
  ConverStation,
};
