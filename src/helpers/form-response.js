const formResponse = (statusCode, result, message, res) => {
  // res.send
  res.status(statusCode).send({
    // statusCode: statusCode,
    // data: result,
    // message: message,
    data: result,
    message: message,
  });
};
module.exports = formResponse;
// const formResponse = (statusCode, result, message, res) => {
//   // res.send
//   res.send({
//     // statusCode: statusCode,
//     // data: result,
//     // message: message,
//     statusCode: statusCode,
//     data: result,
//     message: message,
//   });
// };
// module.exports = formResponse;
