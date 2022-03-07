const { ConverStation } = require("../models/converStationModel");

const postSaveConverStation = async (req, res) => {
  const newConverStation = await ConverStation({
    members: [req.body.senderId, req.body.reciverId],
  });
  try {
    const saveConverStation = await newConverStation.save();
    res.status(200).send({
      data: saveConverStation,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getConverStationByUserId = async (req, res) => {
  try {
    const converStationByUserId = await ConverStation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).send({
      data: converStationByUserId,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

const getTwoUserId = async (req, res) => {
  try {
    const converStation = await ConverStation.findOne({
      members: { $all: [req.params.fisUserId, req.params.serconUserId] },
    });
    res.status(200).send({
      data: converStation,
      code: 200,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      code: 500,
      message: error,
      success: false,
    });
  }
};

module.exports = {
  getConverStationByUserId,
  postSaveConverStation,
  getTwoUserId,
};
