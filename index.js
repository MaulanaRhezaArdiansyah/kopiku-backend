// CONFIG ENV KUDU PALING ATAS COYY
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const router = require("./src/routes/index");
const cors = require("cors");
const { urlencoded, json } = require("body-parser");
app.use(cors());
// static file
// app.use(express.static("public"));
app.use(express.static("public/uploads"));
// menerima application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// menerima json
app.use(json());
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });
// CORS
// app.use(cors());
// const corsOptions = {
//   origin: ["http://localhost:3000", "https://kopikuu.vercel.app"],
//   allowHeaders: ["x-access-token", "content-type"],
//   methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
// };
// app.use(cors(corsOptions));

// Parent Route
app.use("/api/v1", router);

app.get("*", (req, res) => {
  return res.status(404).send({
    message: "Sorry bro, page not found!",
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
