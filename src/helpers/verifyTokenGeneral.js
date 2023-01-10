const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
require("dotenv").config();

const verifyTokenGeneral = (req, res, next) => {
  const token = req.header("Token");
  if (!req.header("Token")) {
    return res.status(400).send({ message: "Token is required" });
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, (error, decoded) => {
      // console.log(decoded);
      if (!error) {
        next();
      } else {
        return res.status(400).send({ message: "Token is invalid" });
      }
    });
  }
};

module.exports = verifyTokenGeneral;
