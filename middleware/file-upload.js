const multer = require("multer");
const { v4: uuid } = require("uuid");
const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limit: 500000, //500kb
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE[file.mimetype];
      cb(null, uuid() + "." + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
