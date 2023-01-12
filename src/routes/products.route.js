const express = require("express");
const router = express();
const verifyToken = require("../helpers/verifyToken");

const productController = require("../controllers/products.controller");
const formUpload = require("../helpers/formUpload");
// const verifyTokenGeneral = require("../helpers/verifyTokenGeneral");

router.get("/", productController.get);
router.get("/:id", productController.getDetail);
router.post(
  "/",
  verifyToken,
  // formUpload.single("image"),
  formUpload.array("image"),
  productController.add
);
// router.put("/:id", productController.updateByPut);
router.patch("/:id", verifyToken, productController.updateByPatch);
router.delete("/:id", verifyToken, productController.remove);

module.exports = router;
