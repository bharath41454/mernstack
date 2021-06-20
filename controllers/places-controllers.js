const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const HttpError = require("../models/https-error");
const getCoordinatesForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  if (!place) {
    // use next if asynch middleware
    // throw error if synch middleware
    const error = new HttpError("Could not find a place for provided id", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesUserId = async (req, res, next) => {
  const userId = req.params.uid;

  // const place = Place.find(userId).exec(); use this to avoid assync/await
  // let place;
  let userWithPlaces;
  try {
    // place = await Place.find({ creator: userId });
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("Fetching places failed, pls try later", 500);
    return next(error);
  }

  // if (!place || place.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find a place for provided user id", 404)
    ); // next doesnt return
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // while working with async throw doesnt work correctly so use next in this case
    // throw new HttpError("Received invalid inputs", 422);
    return next(new HttpError("Received invalid inputs", 422));
  }
  const { title, description, address } = req.body;

  let coordinates;
  try {
    // coordinates = await getCoordinatesForAddress(address);
    coordinates = { lat: 1, lng: 2 };
  } catch (error) {
    return next(error);
  }
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace }); // created successfully created
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Received invalid inputs", 422);
    return next(error);
  }
  const { pid: placeId } = req.params;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update", 500);
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const { pid: placeId } = req.params;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); // to get data from other collection based the relation established
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      404
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this ID", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError("You cant delete this place", 500);
    return next(error);
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.error(err);
  });
  res.status(200).json({ message: "Deleted Place" + placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUserId = getPlacesUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
