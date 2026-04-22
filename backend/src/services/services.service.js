const servicesRepo = require("../repositories/services.repo");

const VALID_CATEGORIES = ["pelu", "akashicos"];

function normalizeServicePayload(payload) {
  const name = String(payload.name || "").trim();
  const description = payload.description == null ? null : String(payload.description).trim();
  const duration_min = Number(payload.duration_min);
  const price = Number(payload.price);
  const category = String(payload.category || "").trim();
  const active =
    payload.active === undefined || payload.active === null
      ? true
      : Boolean(payload.active);

  if (!name) {
    const err = new Error("El nombre es obligatorio");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(duration_min) || duration_min <= 0) {
    const err = new Error("duration_min debe ser un entero mayor a 0");
    err.status = 400;
    throw err;
  }

  if (!Number.isFinite(price) || price < 0) {
    const err = new Error("price debe ser un número mayor o igual a 0");
    err.status = 400;
    throw err;
  }

  if (!VALID_CATEGORIES.includes(category)) {
    const err = new Error("category inválida");
    err.status = 400;
    throw err;
  }

  return {
    name,
    description: description || null,
    duration_min,
    price,
    category,
    active,
  };
}

async function listServices(db, category) {
  const result = await servicesRepo.getActiveServices(db, category);
  return result.rows;
}

async function listAllServices(db) {
  const result = await servicesRepo.getAllServices(db);
  return result.rows;
}

async function createService(db, payload) {
  const normalized = normalizeServicePayload(payload);
  const result = await servicesRepo.createService(db, normalized);
  return result.rows[0];
}

async function updateService(db, id, payload) {
  const existing = await servicesRepo.getServiceById(db, id);

  if (existing.rows.length === 0) {
    const err = new Error("Servicio no encontrado");
    err.status = 404;
    throw err;
  }

  const merged = {
    ...existing.rows[0],
    ...payload,
  };

  const normalized = normalizeServicePayload(merged);
  const result = await servicesRepo.updateService(db, id, normalized);
  return result.rows[0];
}



module.exports = {
  listServices,
  listAllServices,
  createService,
  updateService,
};