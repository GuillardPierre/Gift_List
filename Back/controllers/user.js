const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    //Permet de hasher le mdp donné dans le body.
    const hashPassword = bcrypt.hash(req.body.password, 10);
    //Enregistrement d'un nouveau User.
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: await hashPassword,
      listMembers: [],
    });
    await user.save();
    console.log(user);
    res.status(201).json({ message: "utilisateur créé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du compte" });
    console.error(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log(User);
    const user = await User.findOne({ email: req.body.email });
    console.log(user, req.body);
    //Getion du cas où le user n'est pas trouvé.
    if (!user) {
      console.log("erreur email");
      return res
        .status(401)
        .json({ message: "Paire mail/mot de passe incorrecte" });
    }
    //Si le user est trouvé, le package bcrypt compare le mdp du body et celui enregistré dans la bdd.
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    //Gestion du cas ou le password n'est pas le bon.
    if (!hashedPassword) {
      console.log("erreur mdp");
      return res
        .status(401)
        .json({ message: "Paire mail/mot de passe incorrecte" });
    }
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
        expiresIn: "24h",
      }),
    });
    console.log(user._id);
  } catch (error) {
    res.status(500).json({ message: "Erreur de connexion" });
    console.error(error);
  }
};

//Ce controlleur permet aux autre user de rajouter quelqu'un dans une de ses listes.
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.updateOne(
      {
        _id: req.params.id,
        // Option : rajouter une option où la personne qui vient modifier doit être dans les contacts ajoutés par la personne?
      },
      //Le push n'autorise que les ajouts et ne permet pas de supprimer les autres liste du user
      { $push: { listMembers: req.body.listMembers }, _id: req.params.id }
    );
    console.log(updatedUser);
    if (updatedUser.modifiedCount === 0) {
      res.status(401).json({ message: "modification échouée" });
    } else {
      res.status(200).json({ message: "Liste partagée avec l'utilisateur" });
    }
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
};
