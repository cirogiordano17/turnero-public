-- Agrega estado ASISTIDO al enum de appointment_status
-- NO_SHOW ya cubre "no asistido"

ALTER TYPE public.appointment_status ADD VALUE IF NOT EXISTS 'ASISTIDO';
