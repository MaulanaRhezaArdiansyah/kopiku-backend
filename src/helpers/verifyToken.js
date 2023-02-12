const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = process.env;
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("Token");
  if (!req.header("Token")) {
    return res.status(400).send({ message: "Token is required" });
  } else {
    jwt.verify(token, JWT_PRIVATE_KEY, (error, decoded) => {
      // console.log(decoded);
      // console.log(error);
      if (!error) {
        // this is authorization broo

        // 1 adalah user, 2 adalah admin
        if (decoded.role === "2") {
          next();
        } else if (decoded.role === "1") {
          return res
            .status(403)
            .send({ message: "You cannot access this feature" });
        }
      } else {
        return res.status(400).send({ message: "Token is invalid" });
      }
    });
  }
};

// const verifyToken = (req, res, next) => {
//   const token = req.header("token");
//   if (!req.header("token")) {
//     console.log(token);
//     return res.status(400).send({ message: "Token is required" });
//   } else {
//     // console.log("ok");
//     // next();
//     jwt.verify(token, JWT_PRIVATE_KEY, function (err, decoded) {
//       if (!err) {
//         next();
//         console.log(decoded);
//       } else {
//         console.log(decoded);

//         return res.status(400).send({ message: "Token is invalid" });
//       }
//     });
//   }
// };

module.exports = verifyToken;
