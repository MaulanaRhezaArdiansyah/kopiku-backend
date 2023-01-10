const express = require("express");
const router = express();

const usersProfileController = require("../controllers/usersProfile.controller");

router.get("/", usersProfileController.get);
router.get("/:id", usersProfileController.getDetail);
router.post("/", usersProfileController.add);
router.put("/:id", usersProfileController.updateByPut);
router.patch("/:id", usersProfileController.updateByPatch);
router.delete("/:id", usersProfileController.remove);

module.exports = router;
