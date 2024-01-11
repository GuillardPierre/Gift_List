const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/:id", multer, userCtrl.updateUser);
router.get("/:id", auth, userCtrl.foundUsers);

module.exports = router;
