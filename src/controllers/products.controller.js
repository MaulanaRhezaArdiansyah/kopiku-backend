const formResponse = require("../helpers/form-response");
const productModel = require("../models/products.model");
const { unlink } = require("node:fs");

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

  // getDetail: (req, res) => {
  //   // const id = req.params.id;
  //   const request = {
  //     ...req.body,
  //     id: req.params.id,
  //     file: req.files,
  //   };
  //   return productModel
  //     .getDetail(request)
  //     .then((result) => {
  //       if (result != undefined) {
  //         // if (result != null) {
  //         return formResponse(
  //           200,
  //           result,
  //           "Get data product by id success",
  //           res
  //         );
  //       } else {
  //         return formResponse(400, { result }, "Products id not found", res);
  //       }
  //     })
  //     .catch((error, result) => {
  //       return formResponse(500, { result }, error, res);
  //     });
  // },

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
    // console.log(req.file); // check if single
    // console.log(req.files); // chech if multiple or array
    // console.log(request);
    // console.log(req.body);
    if (
      req.body.title == undefined ||
      // req.body.image == undefined ||
      req.body.price == undefined ||
      req.body.category == undefined ||
      req.body.description == undefined
    ) {
      return res.status(500).send({ message: "Something went wrong" });
    } else {
      if (
        req.body.title.length == 0 ||
        // req.body.image.length == 0 ||
        req.body.price.length == 0 ||
        req.body.category.length == 0 ||
        req.body.description.length == 0
      ) {
        return res
          .status(400)
          .send({ message: "Form add products cannot be empty!" });
      }
      // if array / multiple
      const request = {
        ...req.body,
        file: req.files,
      };
      // if single
      // const request = {
      //   ...req.body,
      //   file: req.file,
      // };
      // console.log(request.file);
      // 1048576 = 1mb
      // if array
      for (let i = 0; i < request.file.length; i++) {
        if (request.file[i].size > 1048576 * 2) {
          return res.status(400).send({ message: "File too large!" });
        }
      }
      // if single
      // if (request.file.size > 1048576 * 2) {
      //   return res.status(400).send({ message: "File too large!" });
      // }
      // sementara errorin aja kalo admin ga masukin image pas add product biar di database postgre ga bertambah
      // console.log(request.file.length);
      if (request.file.length === 0) {
        return res
          .status(400)
          .send({ message: "Image must be exist when adding product!" });
      }
      return productModel
        .add(request)
        .then((result) => {
          // console.log(result);
          // return formResponse(500, , "Something went wrong", res);
          return formResponse(201, result, "Adding data products success", res);
          // console.log(req.body.title);
        })
        .catch((error, result) => {
          return formResponse(500, result, error, res);
        });
    }
  },

  // updateByPut: (req, res) => {
  //   const request = {
  //     ...req.body,
  //     id: req.params.id,
  //   };
  //   return productModel
  //     .updateByPut(request)
  //     .then((result) => {
  //       return formResponse(
  //         200,
  //         result,
  //         "Updating data products by put successfull",
  //         res
  //       );
  //     })
  //     .catch((error) => {
  //       return res.status(500).send({ message: error });
  //       // return formResponse(500, result, error, res);
  //     });
  // },

  updateByPatch: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
      file: req.files,
    };
    // if (request.file.length == 0) {
    //   return res
    //     .status(200)
    //     .send({ message: "success edit data without upload image" });
    // }
    // sementara error handling ini untuk mengantisipasi uplaod file image yang melebihi database uploaded sebelumnya
    if (request.file.length > 2) {
      return res.status(400).send({ message: "fitur ini belum tersedia" });
      // console.log("lebih dari 2 coy");
    }
    return productModel
      .updateByPatch(request)
      .then((result) => {
        // console.log(result);
        if (result.images == undefined) {
          return res.status(200).send({
            data: result,
            message: "Success update data product without upload image!",
          });
        }
        // if (result.length == 0) {
        //   return res.status(400).send({ message: "Product not found!" });
        // }
        for (let i = 0; i < result.oldImages.length; i++) {
          unlink(
            `public/uploads/images/${result.oldImages[i].filename}`,
            (err) => {
              // if (err) throw err;
              // if (err) return err;
              // if (err) console.log("cuyy");
              // console.log("successfully deleted /tmp/hello");
              console.log(
                `successfully deleted ${result.oldImages[i].filename}`
              );
            }
          );
        }
        return res
          .status(200)
          .send({ message: "success update", data: result });
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
        // return res.status(500).send({ message: error });
      });
  },

  remove: (req, res) => {
    const id = req.params.id;
    return productModel
      .remove(id)
      .then((result) => {
        if (result.length == 0) {
          return res.status(400).send({ message: "Product not found!" });
        } // if id wrong
        for (let i = 0; i < result.length; i++) {
          unlink(`public/uploads/images/${result[i].filename}`, (err) => {
            // if (err) throw err;
            if (err) return err;
            // console.log("successfully deleted /tmp/hello");
            console.log(`successfully deleted ${result[i].filename}`);
          });
        }
        // formResponse(200, {}, `Deleting data products ${id} success!`, res);
        return res.status(200).send({
          message: `Deleting data product success!`,
          data: result,
        });
      })
      .catch((error) => {
        // formResponse(500, error, res);
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = productController;
