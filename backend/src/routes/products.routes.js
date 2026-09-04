const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/products.controller");

router.get("/categories", ctrl.getCategories);
router.get("/", ctrl.getProducts);

module.exports = router;
