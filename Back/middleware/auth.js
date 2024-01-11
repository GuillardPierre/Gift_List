const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

module.exports = (req, res, next) => {
  try {
    console.log("début token");
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    console.log("fin token");

    next();
  } catch (error) {
    res.status(401).json({ error });
    console.error(error);
  }
};
