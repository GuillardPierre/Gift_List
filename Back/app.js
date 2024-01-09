const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

//Sert à ajouter les routes qui ajoute/modifie/récupère/supprime les listes cadeaux
const listRoutes = require("./routes/list");
//Sert à ajouter les routes qui permettent de se signup et de se login.
const userRoutes = require("./routes/user");

dotenv.config();
const app = express();
app.use(bodyParser.json());
//ne pas oublier les parenthèses à (cors()).
app.use(cors());
mongoose
  .connect(`${process.env.MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((error) => console.log(error, "Connexion à MongoDB échouée !"));

app.use("/api/list", listRoutes);
app.use("/api/auth", userRoutes);
// Pas sur de comprendre cette ligne
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
