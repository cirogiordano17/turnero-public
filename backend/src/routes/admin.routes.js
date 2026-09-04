const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/admin.controller");
const statsCtrl = require("../controllers/stats.controller");
const authController = require("../controllers/auth.controller");
const adminEventsController = require("../controllers/adminEvents.controller");
const adminServicesCtrl = require("../controllers/adminServices.controller");
const adminClientsCtrl = require("../controllers/adminClients.controller");
const settingsCtrl = require("../controllers/settings.controller");
const productsCtrl = require("../controllers/products.controller");
const { requireAdminAuth, requireSuperAdmin } = require("../middleware/adminAuth.middleware");

// LOGIN (NO protegido)
router.post("/login", authController.login);

// SSE admin
router.get("/events", adminEventsController.openAdminEvents);

// PROTEGIDO
router.get("/me", requireAdminAuth, authController.me);

router.get("/stats/monthly", requireAdminAuth, statsCtrl.getMonthlyStats);

router.get("/appointments/upcoming", requireAdminAuth, ctrl.getUpcomingAppointments);
router.get("/appointments/history", requireAdminAuth, ctrl.getHistoryAppointments);

router.get("/appointments", requireAdminAuth, ctrl.getAdminAppointments);
router.delete("/appointments/:id", requireAdminAuth, ctrl.cancelAdminAppointment);
router.patch("/appointments/:id/confirm-payment", requireAdminAuth, ctrl.confirmAkashicosPayment);
router.patch("/appointments/:id/reschedule", requireAdminAuth, ctrl.rescheduleAdminAppointment);
router.patch("/appointments/:id/attendance", requireAdminAuth, ctrl.markAttendance);


router.get("/closed-days", requireAdminAuth, ctrl.getClosedDays);
router.post("/closed-days", requireAdminAuth, ctrl.blockClosedDay);
router.delete("/closed-days/:date", requireAdminAuth, ctrl.unblockClosedDay);
router.get("/closed-days/all", requireAdminAuth, ctrl.getAllClosedDays
);

// SERVICES ADMIN
router.get("/services", requireAdminAuth, adminServicesCtrl.getAdminServices);
router.post("/services", requireAdminAuth, adminServicesCtrl.createAdminService);
router.patch("/services/:id", requireAdminAuth, adminServicesCtrl.updateAdminService);

router.get("/working-hours", requireAdminAuth, ctrl.getWorkingHours);

// CLIENTS
router.get("/clients", requireAdminAuth, adminClientsCtrl.getClients);
router.post("/clients", requireAdminAuth, adminClientsCtrl.createClient);
router.patch("/clients/:id", requireAdminAuth, adminClientsCtrl.updateClient);
router.delete("/clients/:id", requireAdminAuth, adminClientsCtrl.deleteClient);
router.get("/clients/:id/appointments", requireAdminAuth, adminClientsCtrl.getClientAppointments);

router.patch("/settings/transfer", requireSuperAdmin, settingsCtrl.updateTransferSettings);

// PRODUCTS (super_admin only)
router.get("/products/categories", requireSuperAdmin, productsCtrl.adminGetCategories);
router.post("/products/categories", requireSuperAdmin, productsCtrl.adminCreateCategory);
router.patch("/products/categories/:id", requireSuperAdmin, productsCtrl.adminUpdateCategory);
router.delete("/products/categories/:id", requireSuperAdmin, productsCtrl.adminDeleteCategory);

router.get("/products", requireSuperAdmin, productsCtrl.adminGetProducts);
router.post("/products", requireSuperAdmin, productsCtrl.adminCreateProduct);
router.patch("/products/:id", requireSuperAdmin, productsCtrl.adminUpdateProduct);
router.delete("/products/:id", requireSuperAdmin, productsCtrl.adminDeleteProduct);

router.get("/blocked-slots", requireAdminAuth, ctrl.getBlockedSlots);
router.post("/blocked-slots", requireAdminAuth, ctrl.createBlockedSlot);
router.delete("/blocked-slots/:id", requireAdminAuth, ctrl.deleteBlockedSlot);


module.exports = router;