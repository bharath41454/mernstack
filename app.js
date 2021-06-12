const express = require("express");
const bodyParser = require("body-parser");

const HttpError = require("./models/https-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

// middleware travels from top to bottom so parsebody before using any middleware
app.use(bodyParser.json());

// next to tranfer control to next middleware (app.use)

// middleware that register the places routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500); // 500 -> something went wrong on server
  res.json({ message: error.message || "An unknown error occurred" });
}); // express default special error handler

app.listen(5000);
