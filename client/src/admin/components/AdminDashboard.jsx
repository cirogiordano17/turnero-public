import { useEffect, useState } from "react";
import { getAppointmentsByDate } from "../../api/admin.api";
import AdminHeader from "../components/AdminHeader";
import DayGroup from "../components/DayGroup";

function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("upcoming"); // upcoming | history

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    getAppointmentsByDate(today)
      .then((data) => setAppointments(data.rows || data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-shell">Cargando...</div>;

  // agrupar por fecha
  const grouped = appointments.reduce((acc, appt) => {
    const key = appt.date || appt.start_at.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  return (
    <div className="admin-shell">
      <AdminHeader mode={mode} setMode={setMode} />

      <div className="admin-content">
        {Object.entries(grouped).map(([date, list]) => (
          <DayGroup key={date} date={date} items={list} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;