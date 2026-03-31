const servicesRepo = require("../repositories/services.repo");

async function listServices(db, category) {
  const result = await servicesRepo.getActiveServices(db, category);
  return result.rows;
}

module.exports = { listServices };