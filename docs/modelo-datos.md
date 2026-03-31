services
    id (int)
    name (text)
    duration_min (int)
    category (text: pelu | akashicos)
    active (bool)

clients
    id
    first_name
    last_name
    whatsapp (text, único)
    email (text, nullable)
    notes (text, nullable)

appointments
    id
    client_id (FK)
    start_at (datetime)
    end_at (datetime)
    status (text: CONFIRMADO | CANCELADO | NO_SHOW | PENDIENTE_PAGO)
    comment (text, nullable)
    created_at (datetime)

appointment_services (para combos)
    appointment_id (FK)
    service_id (FK)

working_hours
    id
    day_of_week (1-6)
    start_morning (time)
    end_morning (time)
    start_afternoon (time)
    end_afternoon (time)

closed_days
    id
    date (date, único)
    reason (text, nullable)

admin_users
    id
    email (text, único)
    password_hash (text)