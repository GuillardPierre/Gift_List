const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ownList: { type: Array, required: true },
  listMembers: { type: Array, required: true },
  avatarURL: { type: String, required: false },
});

//Permet d'utiliser le package unique-validator et ne pas avoir plusieurs fois le même user ou email.
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
