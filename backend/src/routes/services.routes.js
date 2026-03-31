const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/services.controller");

router.get("/", ctrl.getServices);

module.exports = router;