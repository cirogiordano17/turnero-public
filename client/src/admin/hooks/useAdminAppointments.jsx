import { useCallback, useEffect, useState } from "react";
import {
  getUpcomingAppointments,
  getHistoryAppointments,
} from "../api/admin.api";

export function useAdminAppointments(mode = "upcoming") {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoadingAppointments(true);
    setAppointmentsError("");

    try {
      const data =
        mode === "history"
          ? await getHistoryAppointments()
          : await getUpcomingAppointments();

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setAppointments([]);
      setAppointmentsError(err.message || "No se pudieron cargar los turnos");
    } finally {
      setLoadingAppointments(false);
    }
  }, [mode]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  async function reloadAppointments() {
    await loadAppointments();
  }

  return {
    appointments,
    loadingAppointments,
    appointmentsError,
    reloadAppointments,
  };
}