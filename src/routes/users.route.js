const express = require("express");
const router = express();

const usersController = require("../controllers/users.controller");
// const verifyToken = require("../helpers/verifyToken");

router.get("/", usersController.get);
router.get("/:id", usersController.getDetail);
router.post("/", usersController.add);
router.patch("/:id", usersController.updateByPatch);
router.delete("/:id", usersController.remove);

module.exports = router;
