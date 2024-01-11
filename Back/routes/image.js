const express = require("express");
const router = express.Router();
const imgCtrl = require("../controllers/image");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.put("/:id", auth, multer, imgCtrl.addImage);

module.exports = router;
