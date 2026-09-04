import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { getMonthlyStats } from "../api/admin.api";
import "../styles/admin-dashboard.css";

function currentYm() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function pesos(n) {
  return `$${Number(n || 0).toLocaleString("es-AR")}`;
}

function nextAppointment(appointments) {
  if (!appointments || appointments.length === 0) return null;
  return [...appointments].sort(
    (a, b) => new Date(a.start_at) - new Date(b.start_at)
  )[0];
}

function formatNextDate(isoStr) {
  return new Date(isoStr).toLocaleDateString("es-AR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function AdminDashboard({ appointments }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMonthlyStats(currentYm())
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  const s = data?.summary;
  const next = nextAppointment(appointments);
  const topService = data?.services?.[0]?.name || "—";

  return (
    <div className="admin-dashboard">
      {loading && <p className="admin-empty">Cargando resumen...</p>}
      {error && <p className="admin-error-box">{error}</p>}

      {!loading && !error && s && (
        <>
          <div className="admin-dashboard__kpis">
            <div className="admin-dashboard__kpi">
              <span className="admin-dashboard__kpi-value">{s.total}</span>
              <span className="admin-dashboard__kpi-label">Turnos este mes</span>
            </div>
            <div className="admin-dashboard__kpi admin-dashboard__kpi--green">
              <span className="admin-dashboard__kpi-value">{s.completed}</span>
              <span className="admin-dashboard__kpi-label">Completados</span>
            </div>
            <div className="admin-dashboard__kpi admin-dashboard__kpi--highlight">
              <span className="admin-dashboard__kpi-value">{pesos(s.total_earned)}</span>
              <span className="admin-dashboard__kpi-label">Cobrado este mes</span>
            </div>
            <div className="admin-dashboard__kpi">
              <span className="admin-dashboard__kpi-value admin-dashboard__kpi-value--sm">{topService}</span>
              <span className="admin-dashboard__kpi-label">Servicio más pedido</span>
            </div>
          </div>

          <div className="admin-dashboard__next">
            <h3 className="admin-dashboard__section-title">Próximo turno</h3>
            {next ? (
              <div className="admin-dashboard__next-card">
                <span className="admin-dashboard__next-name">
                  {next.first_name} {next.last_name}
                </span>
                <span className="admin-dashboard__next-when">
                  {formatNextDate(next.start_at)} · {next.start_hhmm}
                </span>
              </div>
            ) : (
              <p className="admin-empty">No hay próximos turnos.</p>
            )}
          </div>

          {data.daily.length > 0 && (
            <div className="admin-dashboard__chart">
              <h3 className="admin-dashboard__section-title">Ingresos del mes por día</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.daily} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => pesos(v)} labelFormatter={(l) => `Día ${l}`} />
                  <Bar dataKey="earned" name="Cobrado" radius={[4, 4, 0, 0]}>
                    {data.daily.map((_, i) => (
                      <Cell key={i} fill="#9333ea" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
