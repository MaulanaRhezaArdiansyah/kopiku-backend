const formResponse = require("../helpers/form-response");
const usersModel = require("../models/users.model");
const { unlink } = require("node:fs");
// const { request } = require("../routes");

const usersController = {
  get: (req, res) => {
    return usersModel
      .get(req.query)
      .then((result) => {
        // console.log(result);
        // condition is not working
        if (result != undefined) {
          return formResponse(200, result, "Get all data users success", res);
        } else {
          return formResponse(404, result, "Data users not found", res);
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
      });
  },

  getDetail: (req, res) => {
    const id = req.params.id;
    return usersModel
      .getDetail(id)
      .then((result) => {
        if (result != undefined) {
          // if (result != null) {
          return formResponse(200, result, "Get data users by id success", res);
        } else {
          return formResponse(
            400,
            { result },
            "Users not found. Please try again.",
            res
          );
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
      });
  },

  add: (req, res) => {
    if (
      req.body.username == undefined ||
      // req.body.firstname == undefined ||
      // req.body.lastname == undefined ||
      // req.body.gender == undefined ||
      req.body.email == undefined
      //  ||
      // req.body.birthdate == undefined ||
      // req.body.phone == undefined ||
      // req.body.delivery_address == undefined ||
      // req.body.image == undefined ||
      // req.body.password == undefined
    ) {
      return res.status(500).send({ message: "Something went wrong!" });
    } else {
      if (
        req.body.username.length == 0 ||
        // req.body.firstname.length == 0 ||
        // req.body.lastname.length == 0 ||
        req.body.email.length == 0
        // ||
        // req.body.gender.length == 0 ||
        // req.body.birthdate.length == 0 ||
        // req.body.phone.length == 0 ||
        // req.body.delivery_address.length == 0 ||
        // req.body.image.length == 0 ||
        // req.body.password.length == 0
      ) {
        return res
          .status(400)
          .send({ message: "Add data form cannot be empty!" });
      }
      const request = {
        ...req.body,
        file: req.file,
      };
      // if (request.file.size > 1048576 * 5) {
      //   return res.status(400).send({ message: "File too large!" });
      // }
      return usersModel
        .add(request)
        .then((result) => {
          // if (req.body.email != "") {
          return formResponse(201, result, "Adding data users success", res);
          // return formResponse(400, {}, "Email cannot be empty", res);
        })
        .catch((error, result) => {
          return formResponse(500, result, error, res);
        });
    }
  },

  updateByPatch: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
      file: req.files,
    };
    // console.log(request);
    // if (request.file.length == 0) {
    // if (request.file == undefined) {
    //   return res
    //     .status(200)
    //     .send({ message: "success edit data without upload avatar" });
    // }
    return usersModel
      .updateByPatch(request)
      .then((result) => {
        // console.log(result.id);
        // if (result != null) {
        // unlink(`public/uploads/images/${result.oldAvatar.filename}`, (err) => {
        //   // if (err) throw err;
        //   // if (err) return err;
        //   // if (err) console.log("cuyy");
        //   // console.log("successfully deleted /tmp/hello");
        //   console.log(`successfully deleted ${result.oldAvatar.filename}`);
        // });
        if (result != undefined) {
          return formResponse(
            200,
            result,
            "Updating data users by id success",
            res
          );
        } else {
          return formResponse(400, { result }, "Users id not found", res);
        }
      })
      .catch((error, result) => {
        return formResponse(500, { result }, error, res);
        // return res.status(500).send({ message: error });
      });
  },

  remove: (req, res) => {
    const id = req.params.id;
    return usersModel
      .remove(id)
      .then((result) => {
        formResponse(
          200,
          result,
          `Deleting data users ${id}  successfully`,
          res
        );
      })
      .catch((error) => {
        formResponse(500, {}, error, res);
      });
  },
};

module.exports = usersController;
