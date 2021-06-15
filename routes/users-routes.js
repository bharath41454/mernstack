const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const { login, getUsers, signup } = require("../controllers/users-controllers");

router.get("/", getUsers);

router.post("/login", login);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("places").not().isEmpty(),
  ],
  signup
);

module.exports = router;
