const { Router } = require("express");
const convertStationRouter = Router();
const {
  getConverStationByUserId,
  postSaveConverStation,
  getTwoUserId,
} = require("../controllers/convertStation.controller");

convertStationRouter.post("/saveConvertStation", postSaveConverStation);

convertStationRouter.get("/converStationByUserId/:userId", getConverStationByUserId);

convertStationRouter.get("/find/:firstUserId/:secondaryUserId", getTwoUserId);


module.exports = {
  convertStationRouter,
};
