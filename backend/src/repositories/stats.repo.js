async function getMonthlyStats(db, monthStart, monthEnd) {
  const [summaryRes, dailyRes, servicesRes, appointmentsRes] = await Promise.all([
    db.query(
      `SELECT
        COUNT(*)::int                                                                  AS total,
        COUNT(*) FILTER (WHERE status IN ('CONFIRMADO','ASISTIDO'))::int              AS completed,
        COUNT(*) FILTER (WHERE status = 'CANCELADO')::int                             AS cancelled,
        COUNT(*) FILTER (WHERE status = 'NO_SHOW')::int                               AS no_show,
        COUNT(*) FILTER (WHERE status = 'PENDIENTE_PAGO')::int                        AS pending,
        COALESCE(SUM(price_total)    FILTER (WHERE status IN ('CONFIRMADO','ASISTIDO')), 0)::int AS total_earned,
        COALESCE(SUM(duration_total) FILTER (WHERE status IN ('CONFIRMADO','ASISTIDO')), 0)::int AS total_minutes,
        COUNT(*) FILTER (WHERE category = 'pelu'      AND status IN ('CONFIRMADO','ASISTIDO'))::int AS pelu_completed,
        COUNT(*) FILTER (WHERE category = 'akashicos' AND status IN ('CONFIRMADO','ASISTIDO'))::int AS akashicos_completed,
        COALESCE(SUM(price_total) FILTER (WHERE category = 'pelu'      AND status IN ('CONFIRMADO','ASISTIDO')), 0)::int AS pelu_earned,
        COALESCE(SUM(price_total) FILTER (WHERE category = 'akashicos' AND status IN ('CONFIRMADO','ASISTIDO')), 0)::int AS akashicos_earned
       FROM appointments
       WHERE start_at >= $1::timestamptz AND start_at < $2::timestamptz`,
      [monthStart, monthEnd]
    ),

    db.query(
      `SELECT
        TO_CHAR(start_at AT TIME ZONE 'America/Argentina/Cordoba', 'DD') AS day,
        COUNT(*) FILTER (WHERE status IN ('CONFIRMADO','ASISTIDO'))::int  AS completed,
        COALESCE(SUM(price_total) FILTER (WHERE status IN ('CONFIRMADO','ASISTIDO')), 0)::int AS earned
       FROM appointments
       WHERE start_at >= $1::timestamptz AND start_at < $2::timestamptz
       GROUP BY day ORDER BY day`,
      [monthStart, monthEnd]
    ),

    db.query(
      `SELECT
        s.name,
        COUNT(*)::int                         AS count,
        COALESCE(SUM(s.price), 0)::int        AS earned
       FROM appointments a
       JOIN appointment_services aps ON aps.appointment_id = a.id
       JOIN services s               ON s.id = aps.service_id
       WHERE a.start_at >= $1::timestamptz
         AND a.start_at < $2::timestamptz
         AND a.status IN ('CONFIRMADO','ASISTIDO')
       GROUP BY s.id, s.name
       ORDER BY count DESC`,
      [monthStart, monthEnd]
    ),

    db.query(
      `SELECT
        a.id, a.status, a.start_at, a.category,
        a.price_total, a.duration_total,
        c.first_name, c.last_name,
        COALESCE(
          json_agg(json_build_object('name', s.name) ORDER BY s.id)
          FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) AS services
       FROM appointments a
       JOIN clients c ON c.id = a.client_id
       LEFT JOIN appointment_services aps ON aps.appointment_id = a.id
       LEFT JOIN services s ON s.id = aps.service_id
       WHERE a.start_at >= $1::timestamptz AND a.start_at < $2::timestamptz
       GROUP BY a.id, c.id
       ORDER BY a.start_at ASC`,
      [monthStart, monthEnd]
    ),
  ]);

  return {
    summary:      summaryRes.rows[0],
    daily:        dailyRes.rows,
    services:     servicesRes.rows,
    appointments: appointmentsRes.rows,
  };
}

module.exports = { getMonthlyStats };
