const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(error : null, destination : which folder can be used to store the image)
    cb(null, "public/uploads/images");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, `${new Date().getTime()}-${file.originalname}`);

    // resiko jika memakai codingan di bawah ini
    // let fileName = file.originalname.split(".");
    // cb(null, `${fileName[0]}-${new Date().getTime()}.${fileName[1]}`);
  },
});

const formUpload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    let extFile = path.extname(file.originalname);
    if (
      extFile !== ".png" &&
      extFile !== ".jpeg" &&
      extFile !== ".jpg" &&
      extFile !== ".webp"
    ) {
      callback("Only images are allowed!", false);
    } else {
      callback(null, true);
    }
  },
  limits: {
    fileSize: 1048576 * 5, // 5mb
  },
});

module.exports = formUpload;
