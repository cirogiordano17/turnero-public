async function getTransferSettings(db) {
  return db.query(
    `SELECT transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos, shipping_cost FROM settings WHERE id = 1`
  );
}

async function upsertTransferSettings(db, { transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos, shipping_cost }) {
  return db.query(
    `INSERT INTO settings (id, transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos, shipping_cost)
     VALUES (1, $1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
       transfer_cvu = EXCLUDED.transfer_cvu,
       transfer_alias = EXCLUDED.transfer_alias,
       transfer_cuit = EXCLUDED.transfer_cuit,
       transfer_holder_name = EXCLUDED.transfer_holder_name,
       whatsapp = EXCLUDED.whatsapp,
       whatsapp_productos = EXCLUDED.whatsapp_productos,
       shipping_cost = EXCLUDED.shipping_cost
     RETURNING transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos, shipping_cost`,
    [transfer_cvu, transfer_alias, transfer_cuit, transfer_holder_name, whatsapp, whatsapp_productos ?? "", shipping_cost ?? 0]
  );
}

module.exports = { getTransferSettings, upsertTransferSettings };
