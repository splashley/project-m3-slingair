"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { flights } = require("./test-data/flightSeating");
const { reservations } = require("./test-data/reservations");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 8000;

// When we select a flight number from the dropdown,
// it retrieves the flight information
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

// This takes the generated ID from the confirmation (post) request
// The generated ID is used to uniquely identify the user
const handleConfirmation = (req, res) => {
  let userId = req.params.id;
  let reservationInfo = reservations.find((obj) => {
    return obj.id === userId;
  });
  res.send(reservationInfo);
};

// We push the details of the user/flight into the reservation array
const addReservation = (req, res) => {
  let reservation = {
    surname: req.body.surname,
    givenName: req.body.givenName,
    email: req.body.email,
    id: uuidv4(),
    seat: req.body.seat,
    flight: req.body.flight,
  };
  reservations.push(reservation);
  res.send(reservation);
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
  .get("/seat-select/confirmation/:id", handleConfirmation)
  .get("flights", (req, res) => res.status(200).send(flights))
  .post("/users", addReservation)
  .use((req, res) => res.send("Not Found"))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
