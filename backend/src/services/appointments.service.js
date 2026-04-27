const servicesRepo = require("../repositories/services.repo");
const clientsRepo = require("../repositories/clients.repo");
const apptRepo = require("../repositories/appointments.repo");
const blockedRepo = require("../repositories/blockedSlots.repo");


const TZ_OFFSET = "-03:00";

function toIsoWithOffset(start_at) {
  const s = String(start_at);
  if (s.endsWith("Z") || s.includes("+") || s.includes("-03:00")) return s;
  return `${s}${TZ_OFFSET}`;
}

function addMinutesIso(iso, minutes) {
  const d = new Date(iso);
  const end = new Date(d.getTime() + minutes * 60 * 1000);
  return end.toISOString();
}

async function listAppointments(db) {
  const result = await apptRepo.listLatestAppointments(db);
  return result.rows;
}

async function createAppointment(pool, payload) {
  const { first_name, last_name, whatsapp, email, comment, service_ids, start_at, category } = payload;
  const safeCategory = ["pelu", "akashicos"].includes(category) ? category : "pelu";
  const initialStatus = safeCategory === "akashicos" ? "PENDIENTE_PAGO" : "CONFIRMADO";
  


  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // upsert client
    const existing = await clientsRepo.findClientIdByWhatsapp(client, whatsapp);

    let clientId;
    if (existing.rows.length > 0) {
      clientId = existing.rows[0].id;
      await clientsRepo.updateClient(client, { id: clientId, first_name, last_name, email });
    } else {
      const created = await clientsRepo.createClient(client, { first_name, last_name, whatsapp, email });
      clientId = created.rows[0].id;
    }

    // duration
    const durRes = await servicesRepo.sumActiveDurationsByIds(client, service_ids);
    const totalMin = Number(durRes.rows[0].total_min);
    const priceRes = await servicesRepo.sumActivePricesByIds(client, service_ids);
    const totalPrice = Number(priceRes.rows[0].total_price);

    if (totalMin <= 0) {
      const err = new Error("Servicios inválidos o inactivos");
      err.status = 400;
      throw err;
    }

    const startIso = toIsoWithOffset(start_at);
    const endIso = addMinutesIso(startIso, totalMin);

    // closed day
    const closedCheck = await client.query(
      `SELECT 1
       FROM closed_days
       WHERE closed_date = ($1::timestamptz AT TIME ZONE 'America/Argentina/Cordoba')::date
       LIMIT 1`,
      [startIso]
    );
    if (closedCheck.rows.length > 0) {
      const err = new Error("Ese día está bloqueado/cerrado");
      err.status = 409;
      throw err;
    }

    // working hours
    const whCheck = await client.query(
      `
      WITH x AS (
        SELECT
          EXTRACT(ISODOW FROM ($1::timestamptz AT TIME ZONE 'America/Argentina/Cordoba'))::int AS dow,
          (($1::timestamptz AT TIME ZONE 'America/Argentina/Cordoba')::time) AS t_start,
          (($2::timestamptz AT TIME ZONE 'America/Argentina/Cordoba')::time) AS t_end
      )
      SELECT 1
      FROM x
      JOIN working_hours wh ON wh.day_of_week = x.dow
      WHERE
        (
          wh.start_morning IS NOT NULL AND wh.end_morning IS NOT NULL
          AND x.t_start >= wh.start_morning
          AND x.t_end   <= wh.end_morning
        )
        OR
        (
          wh.start_afternoon IS NOT NULL AND wh.end_afternoon IS NOT NULL
          AND x.t_start >= wh.start_afternoon
          AND x.t_end   <= wh.end_afternoon
        )
      LIMIT 1
      `,
      [startIso, endIso]
    );
    if (whCheck.rows.length === 0) {
      const err = new Error("Horario fuera del rango de atención");
      err.status = 409;
      throw err;
    }

    // overlap
    const overlap = await apptRepo.hasOverlap(client, startIso, endIso);
    if (overlap.rows.length > 0) {
      const err = new Error("Horario ocupado. Elegí otro.");
      err.status = 409;
      throw err;
    }

      // blocked slots
  const blocked = await blockedRepo.hasBlockedOverlap(client, startIso, endIso);
  if (blocked.rows.length > 0) {
    const err = new Error("Horario bloqueado por el administrador");
    err.status = 409;
    throw err;
  }


    console.log("TOTAL MIN:", totalMin);
    console.log("TOTAL PRICE:", totalPrice);
    console.log("SERVICE IDS:", service_ids);

    // insert appointment + services
    const apptRes = await apptRepo.insertAppointment(client, {
  clientId,
  startIso,
  totalMin,
  totalPrice,
  comment,
  category: safeCategory,
  status: initialStatus
});
    const appointment = apptRes.rows[0];

    await apptRepo.insertAppointmentServices(client, appointment.id, service_ids);

    await client.query("COMMIT");

    return {
      appointment,
      total_duration_min: totalMin,
      service_ids,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}



module.exports = { listAppointments, createAppointment,  };