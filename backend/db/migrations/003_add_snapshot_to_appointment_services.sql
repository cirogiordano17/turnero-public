ALTER TABLE appointment_services
ADD COLUMN IF NOT EXISTS service_name TEXT,
ADD COLUMN IF NOT EXISTS duration_min INTEGER,
ADD COLUMN IF NOT EXISTS price INTEGER;

UPDATE appointment_services aps
SET
  service_name = s.name,
  duration_min = s.duration_min,
  price = s.price
FROM services s
WHERE aps.service_id = s.id
  AND (
    aps.service_name IS NULL
    OR aps.duration_min IS NULL
    OR aps.price IS NULL
  );

ALTER TABLE appointment_services
ALTER COLUMN service_name SET NOT NULL,
ALTER COLUMN duration_min SET NOT NULL,
ALTER COLUMN price SET NOT NULL;

UPDATE appointments a
SET
  price_total = totals.price_total,
  duration_total = totals.duration_total
FROM (
  SELECT
    appointment_id,
    SUM(price) AS price_total,
    SUM(duration_min) AS duration_total
  FROM appointment_services
  GROUP BY appointment_id
) totals
WHERE a.id = totals.appointment_id;