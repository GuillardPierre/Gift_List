const List = require("../models/List");
const User = require("../models/user");

exports.createNewList = async (req, res, next) => {
  try {
    const newList = new List(req.body);
    console.log(req.body);
    await newList.save();
    res.status(201).json({ message: "Liste enregistrée" });
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};

exports.getOneList = async (req, res, next) => {
  try {
    const oneList = await List.findOne({ _id: req.params.id });
    console.log(oneListlist);
    res.status(200).json({ oneList });
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};

exports.updateOne = async (req, res, next) => {
  console.log("controller modification");
  // Si la modification vient du propriétaire de la liste
  if (req.body.method === "ownerModification") {
    console.log("controller propriétaire");
    try {
      const updatedList = await List.updateOne(
        {
          _id: req.params.id,
          owner: req.auth.userId,
        },
        { ...req.body, _id: req.params.id }
      );
      if (updatedList.matchedCount === 0) {
        res.status(401).json({ message: "modification non autorisée" });
      } else {
        res.status(200).json({ message: "Liste modifiée" });
      }
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
    //Si la modification vientd d'une personne membre de la liste
  } else if (req.body.method === "membersModification") {
    console.log("controller membre liste");
    try {
      const updatedList = await List.updateOne(
        {
          _id: req.params.id,
          members: req.auth.userId,
          "items._id": req.body.itemId,
        },
        //permet seulement de modifier les propriétés purchased pour savoir si un objet est acheté ou non.
        { $set: { "items.$.purchased": req.body.purchased } },
        { $push: { members: "test réussi 1" } }
      );
      if (updatedList.matchedCount === 0) {
        res.status(401).json({ message: "modification non autorisée" });
      } else {
        res.status(200).json({ message: "Liste modifiée" });
      }
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const deletedList = await List.deleteOne({
      _id: req.params.id,
      owner: req.auth.userId,
    });
    console.log("pout", req.params.id);
    console.log(deletedList);
    if (deletedList.deletedCount === 0) {
      res.status(401).json({ message: "modification non autorisée" });
    } else {
      res.status(200).json({ message: "Liste supprimée" });
      await User.updateMany(
        { listMembers: req.params.id },
        { $pull: { listMembers: req.params.id } }
      );
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};
