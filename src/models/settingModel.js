const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settingSchema = new Schema(
  {
    team: { type: String, required: true },
    userUpdatingNotes: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
