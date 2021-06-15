const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // creates internal unique id so it can be queried faster
  password: { type: String, required: true, minLength: 6 },
  image: { type: String, required: true }, // url string
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }], // One user can have n places so use array
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
