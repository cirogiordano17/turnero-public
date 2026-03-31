const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/admin.controller");
const authController = require("../controllers/auth.controller");
const { requireAdminAuth } = require("../middleware/adminAuth.middleware");

// LOGIN (NO protegido)
router.post("/login", authController.login);

// PROTEGIDO
router.get("/me", requireAdminAuth, authController.me);

router.get("/appointments", requireAdminAuth, ctrl.getAdminAppointments);
router.delete("/appointments/:id", requireAdminAuth, ctrl.cancelAdminAppointment);
router.patch("/appointments/:id/confirm-payment", requireAdminAuth, ctrl.confirmAkashicosPayment);

router.post("/closed-days", requireAdminAuth, ctrl.blockClosedDay);
router.delete("/closed-days/:date", requireAdminAuth, ctrl.unblockClosedDay);

module.exports = router;