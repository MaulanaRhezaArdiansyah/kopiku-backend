const formResponse = require("../helpers/form-response");

const cartModel = require("../models/cart.model");

const cartController = {
  get: (req, res) => {
    return cartModel
      .get(req)
      .then((result) => {
        if (result.length == 0) {
          return formResponse(404, result, "Your cart is empty!", res);
        } else {
          return formResponse(200, result, "Get data cart is success!", res);
        }
      })
      .catch((error, result) => {
        return formResponse(500, result, error, res);
      });
  },
  add: (req, res) => {
    const request = { ...req.body };
    return cartModel
      .add(request)
      .then((result) => {
        return formResponse(
          201,
          result,
          "Adding product to cart is success!",
          res
        );
      })
      .catch((error, result) => {
        return formResponse(500, result, error, res);
      });
  },
};

module.exports = cartController;
