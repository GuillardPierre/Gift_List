const User = require("../models/User");
const fs = require("fs");

exports.addImage = async (req, res, next) => {
  if (req.file) {
    try {
      const userObject = req.file
        ? {
            imageUrl: `${req.protocol}://${req.get(
              "host"
            )}/images/${req.file.filename.split(" ").join("_")}`,
          }
        : { ...req.body };
      console.log(userObject);
      const rep = await User.findOne({ _id: req.params.id });
      console.log(rep._id.toString(), req.auth.userId);
      if (rep._id.toString() === req.auth.userId) {
        const rep2 = await User.updateOne(
          { _id: req.params.id },
          { avatarURL: userObject.imageUrl, _id: req.params.id }
        );
        console.log("rep2: ", rep2);
        if (rep2.modifiedCount === 0) {
          res.status(401).json({ message: "La modification a échouée" });
        } else {
          res.status(200).json({ message: "Image enregistrée" });
        }
      }
    } catch (error) {
      console.error("message erreur:", error);
    }
  }
};
