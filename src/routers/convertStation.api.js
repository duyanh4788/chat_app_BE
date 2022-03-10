const { Router } = require("express");
const { ConvertStation } = require("../models/convertStationModel");
const convertStationRouter = Router();
const {
  postSaveConverStation,
} = require("../controllers/convertStation.controller");
const {
  getConverStationByUserId,
} = require("../middlewares/messages/converStation.middleware");

convertStationRouter.post(
  "/saveConvertStation",
  getConverStationByUserId(ConvertStation),
  postSaveConverStation
);

module.exports = {
  convertStationRouter,
};
