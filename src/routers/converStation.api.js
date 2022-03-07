const { Router } = require("express");
const converStationRouter = Router();
const {
  getConverStationByUserId,
  postSaveConverStation,
  getTwoUserId,
} = require("../controllers/converStation.controller");

converStationRouter.post("/saveConverStation", postSaveConverStation);

converStationRouter.get("/converStationByUserId/:userId", getConverStationByUserId);

converStationRouter.get("/find/:firstUserId/:secondUserId", getTwoUserId);


module.exports = {
  converStationRouter,
};
