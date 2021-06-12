const express = require("express");
const router = express.Router();

const {
  getPlaceById,
  getPlaceUserId,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controllers");

router.get("/:pid", getPlaceById);

router.get("/user/:uid", getPlaceUserId);

router.post("/", createPlace);

router.patch("/:pid", updatePlace);
router.delete("/:pid", deletePlace);

module.exports = router;
