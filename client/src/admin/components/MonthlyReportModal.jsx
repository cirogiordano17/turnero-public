import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { getMonthlyStats } from "../api/admin.api";
import "../styles/monthly-report.css";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const STATUS_LABEL = {
  CONFIRMADO:     "Confirmado",
  ASISTIDO:       "Asistió",
  CANCELADO:      "Cancelado",
  NO_SHOW:        "No asistió",
  PENDIENTE_PAGO: "Pendiente de pago",
};

function currentYm() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

function prevMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  const pm = m === 1 ? 12 : m - 1;
  const py = m === 1 ? y - 1 : y;
  return `${py}-${String(pm).padStart(2, "0")}`;
}

function nextMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  const nm = m === 12 ? 1 : m + 1;
  const ny = m === 12 ? y + 1 : y;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

function pesos(n) {
  return `$${Number(n).toLocaleString("es-AR")}`;
}

export default function MonthlyReportModal({ onClose }) {
  const [month, setMonth] = useState(currentYm());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getMonthlyStats(month)
      .then((d) => { if (!cancelled) setData(d); })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [month]);

  const s = data?.summary;

  return (
    <div className="mreport-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mreport-modal">

        {/* HEADER */}
        <div className="mreport-header no-print">
          <h2 className="mreport-title">Resumen mensual</h2>
          <div className="mreport-header-actions">
            <button className="mreport-print-btn" onClick={() => window.print()}>
              Descargar PDF
            </button>
            <button className="mreport-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>
          </div>
        </div>

        {/* TÍTULO PARA IMPRESIÓN */}
        <div className="print-only mreport-print-title">
          Resumen mensual — {formatMonth(month)}
        </div>

        {/* SELECTOR DE MES */}
        <div className="mreport-month-nav no-print">
          <button className="mreport-nav-btn" onClick={() => setMonth(prevMonth(month))}>‹</button>
          <span className="mreport-month-label">{formatMonth(month)}</span>
          <button
            className="mreport-nav-btn"
            onClick={() => setMonth(nextMonth(month))}
            disabled={month >= currentYm()}
          >›</button>
        </div>
        <div className="print-only mreport-month-label--print">{formatMonth(month)}</div>

        {/* CONTENIDO */}
        {loading && <div className="mreport-loading">Cargando...</div>}
        {error   && <div className="mreport-error">{error}</div>}

        {!loading && !error && s && (
          <div className="mreport-body">

            {/* KPIs */}
            <div className="mreport-kpis">
              <div className="mreport-kpi">
                <span className="mreport-kpi__value">{s.total}</span>
                <span className="mreport-kpi__label">Turnos totales</span>
              </div>
              <div className="mreport-kpi mreport-kpi--green">
                <span className="mreport-kpi__value">{s.completed}</span>
                <span className="mreport-kpi__label">Completados</span>
              </div>
              <div className="mreport-kpi">
                <span className="mreport-kpi__value">{s.cancelled}</span>
                <span className="mreport-kpi__label">Cancelados</span>
              </div>
              <div className="mreport-kpi">
                <span className="mreport-kpi__value">{s.no_show}</span>
                <span className="mreport-kpi__label">No asistieron</span>
              </div>
              <div className="mreport-kpi mreport-kpi--highlight">
                <span className="mreport-kpi__value">{pesos(s.total_earned)}</span>
                <span className="mreport-kpi__label">Total cobrado</span>
              </div>
              <div className="mreport-kpi">
                <span className="mreport-kpi__value">{s.total_hours}hs</span>
                <span className="mreport-kpi__label">Horas trabajadas</span>
              </div>
              <div className="mreport-kpi">
                <span className="mreport-kpi__value">{pesos(s.earnings_per_hour)}</span>
                <span className="mreport-kpi__label">Ganancia por hora</span>
              </div>
            </div>

            {/* GRÁFICO: INGRESOS POR DÍA */}
            {data.daily.length > 0 && (
              <div className="mreport-section">
                <h3 className="mreport-section__title">Ingresos por día</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.daily} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => pesos(v)} labelFormatter={(l) => `Día ${l}`} />
                    <Bar dataKey="earned" name="Cobrado" radius={[4, 4, 0, 0]}>
                      {data.daily.map((_, i) => (
                        <Cell key={i} fill="#1f4b33" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* GRÁFICO: POR CATEGORÍA */}
            <div className="mreport-section">
              <h3 className="mreport-section__title">Por categoría</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  layout="vertical"
                  data={[
                    { name: "Peluquería",         turnos: s.pelu_completed,      cobrado: s.pelu_earned },
                    { name: "Registros Akáshicos", turnos: s.akashicos_completed, cobrado: s.akashicos_earned },
                  ]}
                  margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={130} />
                  <Tooltip formatter={(v, n) => n === "cobrado" ? pesos(v) : v} />
                  <Bar dataKey="turnos"  name="Turnos"   fill="#1f4b33" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="cobrado" name="Cobrado"  fill="#4ade80" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* GRÁFICO: SERVICIOS MÁS PEDIDOS */}
            {data.services.length > 0 && (
              <div className="mreport-section">
                <h3 className="mreport-section__title">Servicios más solicitados</h3>
                <ResponsiveContainer width="100%" height={Math.max(120, data.services.length * 40)}>
                  <BarChart
                    layout="vertical"
                    data={data.services}
                    margin={{ top: 4, right: 40, left: 8, bottom: 0 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={160} />
                    <Tooltip />
                    <Bar dataKey="count" name="Veces pedido" fill="#183a28" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* DETALLE DE TURNOS */}
            <div className="mreport-section">
              <h3 className="mreport-section__title">Detalle de turnos</h3>
              {data.appointments.length === 0 ? (
                <p className="mreport-empty">Sin turnos este mes.</p>
              ) : (
                <div className="mreport-table-wrap">
                  <table className="mreport-table">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Categoría</th>
                        <th>Servicios</th>
                        <th>Estado</th>
                        <th>Cobrado</th>
                        <th>Duración</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.appointments.map((a) => (
                        <tr key={a.id} className={`mreport-row--${a.status}`}>
                          <td>{a.start_date}</td>
                          <td>{a.start_hhmm}</td>
                          <td>{a.first_name} {a.last_name}</td>
                          <td>{a.category === "pelu" ? "Peluquería" : "Akáshicos"}</td>
                          <td>{a.services.map((s) => s.name).join(", ") || "—"}</td>
                          <td>{STATUS_LABEL[a.status] ?? a.status}</td>
                          <td>{a.status === "CANCELADO" || a.status === "NO_SHOW" ? "—" : pesos(a.price_total)}</td>
                          <td>{a.duration_total}min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
