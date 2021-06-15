const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");

const HttpError = require("../models/https-error");
const getCoordinatesForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state",
    description: "Famous sky scrapers",
    location: {
      lat: 40.74,
      lng: -73.98,
    },
    address: "Empire state",
    creator: "UI",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log(err);
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
  let place;
  try {
    place = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Fetching paces failed, pls try later", 500);
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for provided user id", 404)
    ); // next doesnt return
  }
  res.json({ places: place.map((place) => place.toObject({ getters: true })) }); // As we have array of items
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // while working with async throw doesnt work correctly so use next in this case
    // throw new HttpError("Received invalid inputs", 422);
    return next(new HttpError("Received invalid inputs", 422));
  }
  const { title, description, coordinates, address, creator } = req.body;

  // let coordinates;
  // try {
  //   coordinates = await getCoordinatesForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.technobuffalo.com/sites/technobuffalo.com/files/styles/large/public/wp/2016/10/google-pixel-sample-photos-edited-054.jpg",
    creator,
  });
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not user for provided id.", 404);
    return next(error);
  }

  try {
    createdPlace.save();
  } catch (err) {
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
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      404
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      404
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted Place" + placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUserId = getPlacesUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
