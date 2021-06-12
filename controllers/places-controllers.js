const { validationResult } = require("express-validator");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/https-error");
const getCoordinatesForAddress = require("../util/location");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    // use next if asynch middleware
    // throw error if synch middleware
    throw new HttpError("Could not find a place for provided id", 404);
  }
  res.json({ place });
};

const getPlacesUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.filter(({ creator }) => {
    return creator === userId;
  });
  if (!place) {
    return next(
      new HttpError("Could not find a place for provided user id", 404)
    ); // next doesnt return
  }
  res.json({ place });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // while working with async throw doesnt work correctly so use next in this case
    // throw new HttpError("Received invalid inputs", 422);
    return next(new HttpError("Received invalid inputs", 422));
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordinatesForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace }); // created successfully created
};

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Received invalid inputs", 422);
  }
  const { pid: placeId } = req.params;
  const { title, description } = req.body;

  const updatedPlace = { ...DUMMY_PLACES.find(({ id }) => id === placeId) };
  const placeIndex = DUMMY_PLACES.findIndex(({ id }) => id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
  const { pid: placeId } = req.params;
  if (!DUMMY_PLACES.some(({ id }) => id === placeId)) {
    throw new HttpError("Could not find place", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter(({ id }) => id !== placeId);
  res.status(200).json({ message: "Deleted Place" + placeId });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesUserId = getPlacesUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
