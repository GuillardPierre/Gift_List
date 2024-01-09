const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/:id", userCtrl.updateUser);
router.get("/:id", auth, userCtrl.foundUsers);

module.exports = router;
