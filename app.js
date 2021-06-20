const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const HttpError = require("./models/https-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

// middleware travels from top to bottom so parsebody before using any middleware
app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images"))); // just return the file

app.use((req, res, next) => {
  // Allow cors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// next to tranfer control to next middleware (app.use)

// middleware that register the places routes
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.error(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500); // 500 -> something went wrong on server
  res.json({ message: error.message || "An unknown error occurred" });
}); // express default special error handler

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iqfzt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Db connection established");
    app.listen(process.env.port || 5000);
    console.log(`app running on port ${process.env.port}`);
  })
  .catch((error) => console.error("error", error));
