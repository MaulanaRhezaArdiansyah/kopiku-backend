const express = require("express");
const router = express();
const cartController = require("../controllers/cart.controller");
// const verifyToken = require("../helpers/verifyToken");

router.get("/", cartController.get);
router.post("/", cartController.add);

module.exports = router;
