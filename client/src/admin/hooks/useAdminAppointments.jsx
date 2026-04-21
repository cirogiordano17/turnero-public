import { useCallback, useEffect, useRef, useState } from "react";
import {
  getUpcomingAppointments,
  getHistoryAppointments,
  connectAdminEvents,
} from "../api/admin.api";

export function useAdminAppointments(mode = "upcoming", enabled = true) {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(enabled);
  const [appointmentsError, setAppointmentsError] = useState("");
  const [liveMessage, setLiveMessage] = useState("");

  const initialLoadedRef = useRef(false);
  const eventSourceRef = useRef(null);

  const loadAppointments = useCallback(
    async ({ silent = false } = {}) => {
      if (!enabled) return;

      if (!silent && !initialLoadedRef.current) {
        setLoadingAppointments(true);
      }

      if (!silent) {
        setAppointmentsError("");
      }

      try {
        const data =
          mode === "history"
            ? await getHistoryAppointments()
            : await getUpcomingAppointments();

        setAppointments(Array.isArray(data) ? data : []);
        initialLoadedRef.current = true;
      } catch (err) {
        if (!silent) {
          setAppointments([]);
          setAppointmentsError(err.message || "No se pudieron cargar los turnos");
        }
      } finally {
        if (!silent && !initialLoadedRef.current) {
          setLoadingAppointments(false);
        } else {
          setLoadingAppointments(false);
        }
      }
    },
    [mode, enabled]
  );

  useEffect(() => {
    initialLoadedRef.current = false;

    if (!enabled) {
      setAppointments([]);
      setAppointmentsError("");
      setLoadingAppointments(false);
      setLiveMessage("");
      return;
    }

    loadAppointments();
  }, [loadAppointments, enabled]);

  useEffect(() => {
    if (!enabled || mode !== "upcoming") return;

    const source = connectAdminEvents({
      onAppointmentCreated: async (data) => {
        const fullName = [data.first_name, data.last_name].filter(Boolean).join(" ");
        setLiveMessage(fullName ? `Nuevo turno: ${fullName}` : "Nuevo turno agendado");
        await loadAppointments({ silent: true });
      },
      onError: () => {
        // EventSource intenta reconectar solo.
      },
    });

    eventSourceRef.current = source;

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [enabled, mode, loadAppointments]);

  useEffect(() => {
    if (!liveMessage) return;

    const t = setTimeout(() => {
      setLiveMessage("");
    }, 4000);

    return () => clearTimeout(t);
  }, [liveMessage]);

  async function reloadAppointments() {
    await loadAppointments({ silent: true });
  }

  return {
    appointments,
    loadingAppointments,
    appointmentsError,
    reloadAppointments,
    liveMessage,
  };
}