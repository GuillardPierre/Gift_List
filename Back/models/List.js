const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  user: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      purchased: { type: Boolean, required: true, default: false },
    },
  ],
  owner: { type: String, required: true },
  members: { type: Array, required: true },
});

module.exports = mongoose.model("Liste", listSchema);
