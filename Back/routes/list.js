const express = require("express");
const stuffCtrl = require("../controllers/list");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, stuffCtrl.createNewList);
router.get("/:id", auth, stuffCtrl.getOneList);
router.put("/:id", auth, stuffCtrl.updateOne);
router.delete("/:id", auth, stuffCtrl.deleteOne);

module.exports = router;
