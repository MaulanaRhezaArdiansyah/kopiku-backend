const express = require("express");
const router = express();
const productRoute = require("./products.route");
// const loginRoute = require("./login.route");
const usersProfileRoute = require("./usersProfile.route");
const authRoute = require("./auth.route");
const usersRoute = require("./users.route");
const cartRoute = require("./cart.route");
// const verifyToken = require("../helpers/verifyToken");

router.get("/", (req, res) => {
  res.send("backend for coffee shop");
});

router.use("/products", productRoute);
// productRoute adalah callback cmiiw
router.use("/users_profile", usersProfileRoute);
router.use("/auth", authRoute);
router.use("/users", usersRoute);
// router.use("/users", verifyToken, usersRoute);
router.use("/cart", cartRoute);

module.exports = router;
