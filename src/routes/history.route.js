const express = require("express");
const router = express();
// const formUpload = require("../helpers/formUpload");

const historyController = require("../controllers/history.controller");

router.get("/:userID", historyController.getDetail);
router.post("/:userID/", historyController.addHistory);
// router.post(
//   "/:userID",
//   formUpload.single("image"),
//   historyController.addHistory
// );
router.delete(
  "/:userID/:historyID",
  historyController.removeHistoryByIdHistory
);

module.exports = router;
