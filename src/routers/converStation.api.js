const { Router } = require("express");
const converStationRouter = Router();
const {
  getConverStationByUserId,
  postSaveConverStation,
  getTwoUserId,
} = require("../controllers/converStation.controller");

converStationRouter.post("/saveConverStation", postSaveConverStation);

converStationRouter.get("/:userId", getConverStationByUserId);

converStationRouter.get("/find/:firstUserId/:secondUserId", getTwoUserId);


module.exports = {
  converStationRouter,
};
