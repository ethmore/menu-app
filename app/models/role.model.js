const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("role", roleSchema);
