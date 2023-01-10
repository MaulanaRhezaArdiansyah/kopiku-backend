const formResponse = require("../helpers/form-response");
const productModel = require("../models/products.model");

const productController = {
  get: (req, res) => {
    return productModel
      .get(req.query)
      .then((result) => {
        if (result.length != 0) {
          // console.log(result.length);
          return formResponse(
            200,
            result,
            "Get all data products success",
            res
          );
        } else {
          // return formResponse(400, result, "Data products not found", res);
          return res.status(404).send({ message: "Data products not found" });
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
      });
  },

  getDetail: (req, res) => {
    const id = req.params.id;
    return productModel
      .getDetail(id)
      .then((result) => {
        if (result != undefined) {
          // if (result != null) {
          return formResponse(
            200,
            result,
            "Get data product by id success",
            res
          );
        } else {
          return formResponse(400, { result }, "Products id not found", res);
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
      });
  },

  add: (req, res) => {
    console.log(req.body);
    if (
      req.body.title == undefined ||
      req.body.image == undefined ||
      req.body.price == undefined ||
      req.body.category == undefined ||
      req.body.description == undefined
    ) {
      return res.status(500).send({ message: "Something went wrong" });
    } else {
      if (
        req.body.title.length == 0 ||
        req.body.image.length == 0 ||
        req.body.price.length == 0 ||
        req.body.category.length == 0 ||
        req.body.description.length == 0
      ) {
        return res
          .status(400)
          .send({ message: "Form add users cannot be empty!" });
      }
      return productModel
        .add(req.body)
        .then((result) => {
          // console.log(result);
          // return formResponse(500, , "Something went wrong", res);
          return formResponse(201, result, "Adding data products success", res);
          // console.log(req.body.title);
          //   if (req.body != undefined) {
          //     return formResponse(201, result, "Adding data products success", res);
          //   } else {
          //     return formResponse(
          //       400,
          //       result,
          //       "Form add product cannot be empty",
          //       res
          //     );
          //   }
        })
        .catch((error, result) => {
          return formResponse(500, result, error, res);
        });
    }
  },

  updateByPut: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return productModel
      .updateByPut(request)
      .then((result) => {
        return formResponse(
          200,
          result,
          "Updating data products by put successfull",
          res
        );
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
        // return formResponse(500, result, error, res);
      });
  },

  updateByPatch: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    // console.log(request.id);
    return productModel
      .updateByPatch(request)
      .then((result) => {
        if (result != null) {
          // if (result.id == request.id) {
          return formResponse(
            200,
            result,
            "Updating data product by id success",
            res
          );
        } else {
          return formResponse(400, { result }, "Products id not found", res);
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
        // return res.status(500).send({ message: error });
      });
  },

  remove: (req, res) => {
    const id = req.params.id;
    // if(id != )

    return productModel
      .remove(id)
      .then(() => {
        // console.log(res);
        formResponse(200, {}, `Deleting data products ${id}  success`, res);
      })
      .catch((error) => {
        formResponse(500, error, res);
      });
  },
};

module.exports = productController;
