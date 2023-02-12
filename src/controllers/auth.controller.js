// const formResponse = require("../helpers/form-response");
const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;

const authController = {
  login: (req, res) => {
    if (req.body.email == undefined || req.body.password == undefined)
      return res.status(500).send({ message: "Something went wrong!" });
    if (req.body.email.length == 0)
      // return res.status(400).send({ message: "Wrong email/password" });
      return res.status(400).send({ message: "Email must be filled!" });
    if (req.body.password.length == 0)
      // return res.status(400).send({ message: "Wrong password/password" });
      return res.status(400).send({ message: "Password must be filled!" });
    return authModel
      .login(req.body)
      .then((result) => {
        //
        // let token = jwt.sign(
        //   { user_id: result.user_id },
        //   // process.env.JWT_PRIVATE_KEY,
        //   JWT_PRIVATE_KEY,
        //   { expiresIn: "1d" },
        //   (err, tokenResult) => {
        //     console.log(tokenResult);
        //   }
        // );
        // return formResponse(200, result, 'success',res)
        // Token
        jwt.sign(
          // { user_id: result.user_id, role: result.role },
          { id: result.id, role: result.role },
          JWT_PRIVATE_KEY,
          { expiresIn: "2 days" },
          (err, tokenResult) => {
            // console.log(result);
            return res.status(200).send({
              message: "Login success!",
              data: {
                token: tokenResult,
                user: {
                  // user_id: result.user_id,
                  id: result.id,
                  email: result.email,
                  role: result.role,
                  image: result.image,
                  // displayname: result.displayname,
                  username: result.username,
                },
              },
            });
          }
        );
      })
      .catch((error) => {
        // return res.status(500).send({ message: error });
        return res.status(400).send({ message: error });
      });
  },

  register: (req, res) => {
    // if register form was error
    if (
      req.body.email == undefined ||
      req.body.password == undefined ||
      req.body.phone == undefined
    ) {
      return res
        .status(500)
        .send({ message: "Something went wrong on register form!" });
    } else {
      if (req.body.email.length == 0) {
        return res.status(400).send({ message: "Email must be filled!" });
      } else if (!req.body.email.includes("@gmail.com")) {
        return res
          .status(400)
          .send({ message: "Email must be filled by @gmail.com format!" });
      } else if (req.body.password.length == 0) {
        return res.status(400).send({ message: "Password must be filled!" });
      } else if (req.body.phone.length == 0) {
        return res
          .status(400)
          .send({ message: "Phone number must be filled!" });
      } else {
        if (req.body.password.length <= 8) {
          return res
            .status(400)
            .send({ message: "Password must be longer than 8 characters!" });
        } else {
          // time to hashing password
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({ message: err.message });
            } else {
              const request = {
                // email: req.body.email,
                // password: hash,
                // phone: req.body.phone,
                ...req.body,
                password: hash,
              };
              return authModel
                .register(request)
                .then((result) => {
                  return res
                    .status(201)
                    .send({ message: "Register success!", data: result });
                })
                .catch((error) => {
                  return res.status(400).send({ message: error });
                });
            }
          });
        }
      }
    }
  },
};

module.exports = authController;
