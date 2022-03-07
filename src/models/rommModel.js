const mongoose = require("mongoose");
const { User } = require("./userModel");
const { TitleModel } = require("../common/common.constants");

const RoomSchema = mongoose.Schema({
  listUser: [User],
});

const Room = mongoose.model(TitleModel.ROOM, RoomSchema);

module.exports = {
  Room,
};
