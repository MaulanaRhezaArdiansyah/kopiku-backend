const formResponse = require("../helpers/form-response");
const usersProfileModel = require("../models/usersProfile.model");

const usersProfileController = {
  get: (req, res) => {
    return usersProfileModel
      .get()
      .then((result) => {
        return formResponse(
          200,
          result,
          "Get all data users profile success",
          res
        );
      })
      .catch((error) => {
        // ini belum berjalan
        return formResponse(500, error, "Cannot get data", res);
        // return res.status(500).send({ message: error });
      });
  },

  getDetail: (req, res) => {
    const id = req.params.id;
    return usersProfileModel
      .getDetail(id)
      .then((result) => {
        // return res.status(200).send({ data: result });
        return formResponse(
          200,
          result,
          "Get data users profile by id success",
          res
        );
      })
      .catch((error) => {
        // ini belum berjalan
        // return formResponse(500, result, error, res);
        return res.status(500).send({ message: error });
      });
  },

  add: (req, res) => {
    return usersProfileModel
      .add(req.body)
      .then((result) => {
        // return res.status(201).send({ message: "Add data products success", data: result });
        return formResponse(
          201,
          result,
          "Adding data users profile success",
          res
        );
      })
      .catch((error) => {
        // ini belum berjalan
        // return formResponse(500, result, error, res);
        return res.status(500).send({ message: error });
      });
  },

  updateByPut: (req, res) => {
    const request = {
      ...req.body,
      id: req.params.id,
    };
    return usersProfileModel
      .updateByPut(request)
      .then((result) => {
        return formResponse(
          200,
          result,
          "Updating data users profile by put successfull",
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
    return usersProfileModel
      .updateByPatch(request)
      .then((result) => {
        // return res.status(200).send({message: "Updating data products by patch success",data: result});
        return formResponse(
          200,
          result,
          "Updating data users profile by patch successfull",
          res
        );
      })
      .catch((error) => {
        // return formResponse(500, result, error, res);
        return res.status(500).send({ message: error });
      });
  },

  remove: (req, res) => {
    const id = req.params.id;
    return usersProfileModel
      .remove(id)
      .then((message) => {
        // ini belum sempurna
        // return formResponse(
        //   200,
        //   result,
        //   `Deleting data products ${id} successfull`,
        //   res
        // );
        return (
          res
            .status(200)
            //   .send(`Deleting data users profile ${id}  success`);
            .send(message)
        );
      })
      .catch((error) => {
        return res.status(500).send({ message: error });
      });
  },
};

module.exports = usersProfileController;
