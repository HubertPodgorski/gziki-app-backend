const SettingModel = require("../models/settingModel");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// get settings
const getSettings = async (callback, userToken) => {
  const { team } = jwt.decode(userToken);

  const settings = await SettingModel.findOne({ team });

  callback(settings);
};

// update settings
const updateSettings = async (received, io, userToken) => {
  const { team } = jwt.decode(userToken);

  const settings = await SettingModel.findOneAndUpdate(
    { team },
    { ...received },
    { new: true }
  );

  io.to(team).emit("settings_updated", settings);
};

module.exports = {
  getSettings,
  updateSettings,
};
