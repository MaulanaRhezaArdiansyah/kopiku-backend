// CONFIG ENV KUDU PALING ATAS COYYYYYY
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const router = require("./src/routes/index");
const cors = require("cors");
const { urlencoded, json } = require("body-parser");

// static file
app.use(express.static("public"));
// menerima application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// menerima json
app.use(json());
// app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://kopikuu.vercel.app/");
//   next();
// });
// CORS
// app.use(cors());
app.use(
  cors({
    origin: `http://localhost:3000/`,
  })
);

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
