const User = require("../models/User");
const fs = require("fs");

exports.addImage = async (req, res, next) => {
  console.log(req.body);
  //   if (req.files) {
  //     try {
  //       console.log("il y a un reqfile");
  //       const userObject = req.files.image
  //         ? {
  //             imageUrl: `${req.protocol}://${req.get("host")}/images/${
  //               req.files.image.filename
  //             }`,
  //           }
  //         : { ...req.body };
  //       console.log(userObject);
  //       delete userObject._id;
  //       const rep = await User.findOne(req.params.id);
  //       if (rep._id === req.auth.userId) {
  //         const rep2 = await User.updateOne(
  //           { _id: req.params.id },
  //           { avatarUrl: userObject, _id: req.params.id }
  //         );
  //         console.log("rep2: ", rep2);
  //       }
  //     } catch (error) {}
  //   }
};
