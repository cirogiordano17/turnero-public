const settingsRepo = require("../repositories/settings.repo");

async function getTransferSettings(req, res) {
  try {
    const result = await settingsRepo.getTransferSettings(req.app.locals.db);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error("Error GET /api/settings/transfer:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateTransferSettings(req, res) {
  const { transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos, shipping_cost } = req.body;
  try {
    const result = await settingsRepo.upsertTransferSettings(req.app.locals.db, {
      transfer_cvu: transfer_cvu?.trim() ?? "",
      transfer_alias: transfer_alias?.trim() ?? "",
      transfer_cuit: transfer_cuit?.trim() ?? "",
      transfer_holder_name: transfer_holder_name?.trim() ?? "",
      whatsapp: whatsapp?.trim() ?? "",
      whatsapp_productos: whatsapp_productos?.trim() ?? "",
      shipping_cost: Number(shipping_cost) || 0,
    });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error PATCH /api/admin/settings/transfer:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getTransferSettings, updateTransferSettings };
