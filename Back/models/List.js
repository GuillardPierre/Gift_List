const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  name: { type: String, required: true },
  list: [
    {
      name: { type: String, required: true },
      purchased: { type: Boolean, required: true, default: false },
    },
  ],
  owner: { type: String, required: true },
  ownerName: { type: String, required: true },
  members: { type: Array, required: true },
  imageUrl: { type: String },
});

module.exports = mongoose.model("Liste", listSchema);
