const List = require("../models/List");
const User = require("../models/User");
const fs = require("fs");

exports.createNewList = async (req, res, next) => {
  try {
    const listObject = req.body;
    delete listObject._id;
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }
    const nomListe = req.body.name;
    const newList = new List({
      ...listObject,
      owner: req.auth.userId,
      imageUrl: imageUrl,
    });
    await newList.save();
    const list = await List.findOne({ owner: req.auth.userId, name: nomListe });
    owner = await User.findOne({ _id: req.auth.userId });
    if (owner._id.toString() === list.owner) {
      const modif = await User.updateOne(
        { _id: req.auth.userId },
        { $push: { ownList: list._id.toString() } }
      );
    }
    res.status(201).json({ message: "Liste enregistrée" });
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};

exports.getOneList = async (req, res, next) => {
  try {
    const oneList = await List.findOne({ _id: req.params.id });
    res.status(200).json({ name: oneList.name, list: oneList.list });
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
      const listObject = req.file
        ? {
            ...req.body,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      delete listObject._id;
      delete listObject.owner;

      const updatedList = await List.updateOne(
        {
          _id: req.params.id,
          owner: req.auth.userId,
        },
        { ...listObject, _id: req.params.id }
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
    const list = await List.findOne({
      _id: req.params.id,
      owner: req.auth.userId,
    });
    if (list && list.imageUrl) {
      const filename = list.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`);
    }
    const deletedList = await List.deleteOne({
      _id: req.params.id,
      owner: req.auth.userId,
    });
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
