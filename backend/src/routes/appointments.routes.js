const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/appointments.controller");

router.post("/", ctrl.createAppointment);

module.exports = router;