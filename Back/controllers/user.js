const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require("../routes/list");

const saltRounds = 10;

exports.signup = async (req, res, next) => {
  try {
    console.log("controller signup");
    //Permet de hasher le mdp donné dans le body.
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashPassword);
    //Enregistrement d'un nouveau User.
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: hashPassword,
      listMembers: [],
    });
    console.log(hashPassword);
    await user.save();
    res.status(201).json({ message: "utilisateur créé", signup: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création du compte", signup: false });
    console.error(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
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
      return res
        .status(401)
        .json({ message: "Paire mail/mot de passe incorrecte" });
    }
    res.status(200).json({
      connected: true,
      userName: user.userName,
      email: user.email,
      ownList: user.ownList,
      listMembers: user.listMembers,
      token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur de connexion" });
    console.error(error);
  }
};

//Ce controlleur permet aux autre user de rajouter quelqu'un dans une de ses listes.
exports.updateUser = async (req, res, next) => {
  try {
    if (req.file) {
      console.log("il y a un reqfile");
      const userObject = req.file
        ? {
            // ...JSON.parse(req.body),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      console.log(userObject);
      delete userObject._id;
      const rep = await User.findOne(req.params.id);
      if (rep._id === req.auth.userId) {
        const rep2 = await User.updateOne(
          { _id: req.params.id },
          { ...req.body, _id: req.params.id }
        );
        if (rep2.modifiedCount === 0) {
          res.status(401).json({ message: "modification échouée" });
        } else {
          res
            .status(200)
            .json({ message: "Liste partagée avec l'utilisateur" });
        }
      }
    }

    const updatedUser = await User.updateOne(
      {
        _id: req.params.id,
        // Option : rajouter une option où la personne qui vient modifier doit être dans les contacts ajoutés par la personne?
      },
      // Le push n'autorise que les ajouts et ne permet pas de supprimer les autres listes du user
      { $push: { listMembers: req.body.listMembers }, _id: req.params.id }
    );

    if (updatedUser.modifiedCount === 0) {
      res.status(401).json({ message: "modification échouée" });
    } else {
      res.status(200).json({ message: "Liste partagée avec l'utilisateur" });
    }
  } catch (error) {
    res.status(400).json(error);
    console.error("Erreur modification user : ", error);
  }
};

exports.foundUsers = async (req, res, next) => {
  try {
    const listeUsers = await User.find({ userName: req.params.id }).select(
      "-_id email userName listMembers ownList listMembers"
    );
    delete listeUsers._id;
    res.status(200).json({ listeUsers });
  } catch (error) {}
};
