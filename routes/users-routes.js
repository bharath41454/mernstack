const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { login, getUsers, signup } = require("../controllers/users-controllers");
const fileUpload = require("../middleware/file-upload");

router.get("/", getUsers);

router.post("/login", login);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

module.exports = router;
