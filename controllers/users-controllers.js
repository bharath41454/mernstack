const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");

const HttpError = require("../models/https-error");
const User = require("../models/user");

const DUMMY_USERS = [
  { name: 'id: "u1', name: "B", mail: "b@b.com", password: "......" },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  console.log(users);
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Received invalid inputs", 422);
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exist already, please login", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      "https://www.technobuffalo.com/sites/technobuffalo.com/files/styles/large/public/wp/2016/10/google-pixel-sample-photos-edited-054.jpg",
    password,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials , try again", 401);
    return next(error);
  }
  res.json({ message: "Logged in successfully" });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
