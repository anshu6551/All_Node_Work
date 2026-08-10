const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: "" },
  refreshToken: { type: String  , default:""},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("register", registerSchema);
