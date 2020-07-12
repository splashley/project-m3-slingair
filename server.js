"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");

const PORT = process.env.PORT || 8000;

const handleFlight = (req, res) => {
  let flightNumber = req.params.flightNumber;

  let flightExists = Object.keys(flights).includes(flightNumber);
  let flightData = [];

  if (flightExists) {
    //Found flight get the data
    flightData = flights[flightNumber];
  }

  res.send(flightData);
};

express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })

  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // endpoints
  .get("/flights/:flightNumber", handleFlight)
  .get("/seat-select/confirmed/:id", handleConfirmation)
  .get("flights", (req, res) => res.status(200).send(flights))
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
