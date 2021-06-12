const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { login, getUsers, signup } = require("../controllers/users-controllers");

router.get("/", getUsers);

router.post("/login", login);

router.post(
  "/signup",
  [
    check("userName").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

module.exports = router;
