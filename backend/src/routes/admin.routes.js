const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/admin.controller");
const authController = require("../controllers/auth.controller");
const adminEventsController = require("../controllers/adminEvents.controller");
const adminServicesCtrl = require("../controllers/adminServices.controller");
const { requireAdminAuth } = require("../middleware/adminAuth.middleware");

// LOGIN (NO protegido)
router.post("/login", authController.login);

// SSE admin
router.get("/events", adminEventsController.openAdminEvents);

// PROTEGIDO
router.get("/me", requireAdminAuth, authController.me);

router.get("/appointments/upcoming", requireAdminAuth, ctrl.getUpcomingAppointments);
router.get("/appointments/history", requireAdminAuth, ctrl.getHistoryAppointments);

router.get("/appointments", requireAdminAuth, ctrl.getAdminAppointments);
router.delete("/appointments/:id", requireAdminAuth, ctrl.cancelAdminAppointment);
router.patch("/appointments/:id/confirm-payment", requireAdminAuth, ctrl.confirmAkashicosPayment);

router.post("/closed-days", requireAdminAuth, ctrl.blockClosedDay);
router.delete("/closed-days/:date", requireAdminAuth, ctrl.unblockClosedDay);

// SERVICES ADMIN
router.get("/services", requireAdminAuth, adminServicesCtrl.getAdminServices);
router.post("/services", requireAdminAuth, adminServicesCtrl.createAdminService);
router.patch("/services/:id", requireAdminAuth, adminServicesCtrl.updateAdminService);


module.exports = router;