const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  login: {type: String, unique: true},
  password: {type: String},
});

module.exports = mongoose.model("user", userSchema);
