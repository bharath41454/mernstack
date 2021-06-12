const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/https-error");

const DUMMY_USERS = [
  { name: 'id: "u1', name: "B", mail: "b@b.com", password: "......" },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Received invalid inputs", 422);
  }

  const { userName, email, password } = req.body;

  const hasUser = DUMMY_USERS.some(({ email: emailId }) => emailId === email);

  if (hasUser) {
    throw new HttpError("Could not create user, email already exists.", 422);
  }

  const createdUser = {
    id: uuid(),
    userName,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const idenfifiedUser = DUMMY_USERS.find(
    ({ email: emailId, password: pwd }) => emailId === email && pwd === password
  );
  console.log("user", idenfifiedUser);

  if (!idenfifiedUser) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
  }
  res.json({ message: "Logged in successfully" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
