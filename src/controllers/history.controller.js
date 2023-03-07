const formResponse = require("../helpers/form-response");
const historyModel = require("../models/history.model");
// const {unlink} = require('node:fs')

const historyController = {
  getDetail: (req, res) => {
    const userID = req.params.userID;
    return historyModel
      .getDetail(userID)
      .then((result) => {
        // console.log(result);
        if (result.length != 0)
          return formResponse(
            200,
            result,
            `Successfully get your history!`,
            res
          );
        // return formResponse(400, {}, `Oops.. Your history is empty!`, res);
      })
      .catch((err) => {
        return formResponse(500, {}, err, res);
      });
  },

  addHistory: (req, res) => {
    const request = {
      ...req.body,
      // file: req.file,
      userID: req.params.userID,
    };
    return historyModel
      .addHistory(request)
      .then((result) => {
        return formResponse(201, result, "Adding to history is success!", res);
      })
      .catch((error) => {
        return formResponse(500, {}, error, res);
      });
  },

  removeHistoryByIdHistory: (req, res) => {
    const request = {
      userID: req.params.userID,
      historyID: req.params.historyID,
    };
    return historyModel
      .removeHistoryByIdHistory(request)
      .then((result) => {
        const productTitle = result.product_title;
        return formResponse(
          200,
          result,
          `Successfully delete ${productTitle} from your order history!`,
          res
        );
      })
      .catch((error) => {
        return formResponse(500, {}, error, res);
      });
  },
};

module.exports = historyController;
