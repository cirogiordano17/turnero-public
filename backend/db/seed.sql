INSERT INTO services (id, name, duration_min, price, category, active) VALUES
  (1, 'Corte', 30, 25000, 'pelu', true),
  (2, 'Color', 60, 45000, 'pelu', true),
  (3, 'Mechas', 120, 12000, 'pelu', true),
  (4, 'Alisado', 120, 15000, 'pelu', true),
  (5, 'Keratina', 120, 15000, 'pelu', true),
  (6, 'Balayage', 150, 18000, 'pelu', true),
  (7, 'Registros Akáshicos', 120, 45000, 'akashicos', true);

SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));

INSERT INTO working_hours (day_of_week, start_morning, end_morning, start_afternoon, end_afternoon) VALUES
  (1, '09:00', '13:00', '15:00', '20:00'),
  (2, '09:00', '13:00', '15:00', '20:00'),
  (3, '09:00', '13:00', '15:00', '20:00'),
  (4, '09:00', '13:00', '15:00', '20:00'),
  (5, '09:00', '13:00', '15:00', '20:00'),
  (6, '09:00', '13:00', '15:00', '20:00')
ON CONFLICT (day_of_week) DO NOTHING;