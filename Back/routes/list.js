const express = require("express");
const stuffCtrl = require("../controllers/list");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const router = express.Router();

router.post("/", auth, multer, stuffCtrl.createNewList);
router.get("/:id", auth, stuffCtrl.getOneList);
router.put("/:id", auth, multer, stuffCtrl.updateOne);
router.delete("/:id", auth, stuffCtrl.deleteOne);

module.exports = router;
