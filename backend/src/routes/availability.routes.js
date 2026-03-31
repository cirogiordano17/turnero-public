const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/availability.controller");

router.get("/", ctrl.getAvailability);

module.exports = router;