import { useEffect, useMemo, useState } from "react";
import { getAvailability } from "../api/availability";
import { createAppointment } from "../api/appointments";
import {
  addDays,
  formatDateISO,
  getTomorrow,
  getWeekDays,
} from "../utils/dates";

function useBooking({ category }) {
  const tomorrow = getTomorrow();

  const [services, setServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [daysStart, setDaysStart] = useState(tomorrow);
  const [selectedDate, setSelectedDate] = useState(formatDateISO(tomorrow));
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [isClosed, setIsClosed] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
  });

  function toggleService(id) {
    setSelectedSlot("");

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const selectedServices = useMemo(() => {
    return services.filter((service) => selectedIds.includes(service.id));
  }, [services, selectedIds]);

  const totalDuration = useMemo(() => {
    return selectedServices.reduce(
      (acc, service) => acc + (service.duration_min || 0),
      0
    );
  }, [selectedServices]);

  const endTime = useMemo(() => {
    if (!selectedSlot || !totalDuration) return "";

    const [hours, minutes] = selectedSlot.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + totalDuration;

    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  }, [selectedSlot, totalDuration]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce(
      (acc, service) => acc + (service.price || 0),
      0
    );
  }, [selectedServices]);

  const visibleDays = useMemo(() => {
    return getWeekDays(daysStart, 7);
  }, [daysStart]);

  const canGoPrev = useMemo(() => {
    return formatDateISO(daysStart) > formatDateISO(tomorrow);
  }, [daysStart, tomorrow]);

  async function loadAvailability(date, ids) {
    try {
      setLoadingSlots(true);
      setSlotsError("");

      const data = await getAvailability(date, ids, category);

      if (data?.closed) {
        setSlots([]);
        setIsClosed(true);
      } else {
        setSlots(Array.isArray(data?.slots) ? data.slots : []);
        setIsClosed(false);
      }
    } catch (err) {
      console.error(err);
      setSlotsError("No se pudieron cargar los horarios.");
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

useEffect(() => {
  setSelectedSlot("");
  setSlots([]);

  if (!selectedDate || !selectedIds.length) return;

  loadAvailability(selectedDate, selectedIds);
}, [selectedDate, selectedIds]);

  function handlePrevDays() {
    if (!canGoPrev) return;

    setDaysStart((prev) => {
      const next = addDays(prev, -7);
      return formatDateISO(next) < formatDateISO(tomorrow) ? tomorrow : next;
    });
  }

  function handleNextDays() {
    setDaysStart((prev) => addDays(prev, 7));
  }

  function validateFields() {
    const whatsappDigits = whatsapp.trim();

    const errors = {
      firstName: firstName.trim() ? "" : "Este campo es obligatorio",
      lastName: lastName.trim() ? "" : "Este campo es obligatorio",
      whatsapp: !whatsappDigits
        ? "Este campo es obligatorio"
        : !/^\d+$/.test(whatsappDigits)
        ? "Ingresá solo números"
        : whatsappDigits.length < 8
        ? "Ingresá un número válido"
        : "",
    };

    setFieldErrors(errors);

    return !errors.firstName && !errors.lastName && !errors.whatsapp;
  }

  async function handleSubmit() {
    if (!validateFields()) {
      setSubmitError("");
      return;
    }

    if (!selectedIds.length || !selectedDate || !selectedSlot) {
      setSubmitError("Elegí servicio, fecha y horario.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || null,
        comment: comment.trim() || null,
        category,
        start_at: `${selectedDate}T${selectedSlot}:00-03:00`,
        service_ids: selectedIds,
      };

      await createAppointment(payload);
      await loadAvailability(selectedDate, selectedIds);

      setSelectedSlot("");
      setBookingSuccess(true);
    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "No se pudo confirmar el turno.";

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetBooking() {
    const tomorrow = getTomorrow();

    setSelectedIds([]);
    setServices([]);

    setDaysStart(tomorrow);
    setSelectedDate(formatDateISO(tomorrow));
    setSlots([]);
    setSelectedSlot("");

    setFirstName("");
    setLastName("");
    setWhatsapp("");
    setEmail("");
    setComment("");

    setSubmitError("");
    setBookingSuccess(false);

    setFieldErrors({
      firstName: "",
      lastName: "",
      whatsapp: "",
    });
  }

  return {
    services,
    selectedIds,
    selectedDate,
    slots,
    selectedSlot,
    loadingSlots,
    slotsError,

    firstName,
    lastName,
    whatsapp,
    email,
    comment,

    submitting,
    submitError,
    bookingSuccess,
    fieldErrors,

    selectedServices,
    totalDuration,
    endTime,
    totalPrice,
    visibleDays,
    canGoPrev,

    setServices,
    setSelectedDate,
    setSelectedSlot,
    setFirstName,
    setLastName,
    setWhatsapp,
    setEmail,
    setComment,
    setFieldErrors,

    toggleService,
    handlePrevDays,
    handleNextDays,
    handleSubmit,
    resetBooking,
    isClosed,
  };
}

export default useBooking;