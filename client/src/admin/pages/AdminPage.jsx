import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { CONTACT } from "../../config/contact";
import { useAdminAppointments } from "../hooks/useAdminAppointments";
import AdminLoginForm from "../components/AdminLoginForm";
import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboard from "../components/AdminDashboard";
import DayGroup from "../components/DayGroup";
import AdminServicesModal from "../components/AdminServicesModal";
import AdminClientsModal from "../components/AdminClientsModal";
import AdminTransferModal from "../components/AdminTransferModal";
import AdminProductsModal from "../components/AdminProductsModal";
import MonthlyReportModal from "../components/MonthlyReportModal";
import "../styles/admin.css";

function groupAppointmentsByDate(appointments) {
  return appointments.reduce((acc, appointment) => {
    const dateKey = appointment.start_at.slice(0, 10);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(appointment);
    return acc;
  }, {});
}

function AdminPage() {
  const [view, setView] = useState("inicio");
  const [mode, setMode] = useState("upcoming");
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [clientsModalOpen, setClientsModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [monthlyReportOpen, setMonthlyReportOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    admin,
    loading,
    login,
    logout,
    loginError,
    loginLoading,
  } = useAdminAuth();

  const isAuthReady = !loading && !!admin;

  const {
    appointments,
    loadingAppointments,
    appointmentsError,
    reloadAppointments,
    liveMessage,
  } = useAdminAppointments(mode, isAuthReady);

  const groupedAppointments = useMemo(
    () => groupAppointmentsByDate(appointments),
    [appointments]
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Turnero | Admin";

    return () => {
      document.title = previousTitle || CONTACT.salonName;
    };
  }, []);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-shell">Cargando...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="admin-page admin-page--login">
        <div className="admin-shell admin-shell--login">
          <AdminLoginForm
            onSubmit={login}
            loading={loginLoading}
            error={loginError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-page--dashboard">
      <AdminSidebar
        admin={admin}
        view={view}
        setView={setView}
        mode={mode}
        setMode={setMode}
        onLogout={logout}
        onManageServices={() => setServicesModalOpen(true)}
        onManageClients={() => setClientsModalOpen(true)}
        onManageTransfer={() => setTransferModalOpen(true)}
        onManageProducts={() => setProductsModalOpen(true)}
        onMonthlyReport={() => setMonthlyReportOpen(true)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
      <div className="admin-shell">
        <AdminHeader view={view} mode={mode} onToggleSidebar={() => setSidebarOpen(true)} />

        {view === "inicio" ? (
          <div className="admin-content admin-content--upcoming">
            <AdminDashboard appointments={appointments} />
          </div>
        ) : (
          <div
            className={`admin-content ${
              mode === "history"
                ? "admin-content--history"
                : "admin-content--upcoming"
            }`}
          >
            {liveMessage && <div className="admin-live-toast">{liveMessage}</div>}

            <div className="admin-section-head">
              <h2>
                {mode === "history" ? "Historial de Turnos" : "Próximos Turnos"}
              </h2>
              <p>
                {appointments.length}{" "}
                {mode === "history" ? "turnos anteriores" : "turnos programados"}
              </p>
            </div>

            {loadingAppointments ? (
              <div className="admin-empty">Cargando turnos...</div>
            ) : appointmentsError ? (
              <div className="admin-error-box">{appointmentsError}</div>
            ) : appointments.length === 0 ? (
              <div className="admin-empty">
                {mode === "history"
                  ? "No hay turnos en el historial."
                  : "No hay próximos turnos."}
              </div>
            ) : (
              <div className="admin-day-groups">
                {Object.entries(groupedAppointments).map(([date, items]) => (
                  <DayGroup
                    key={date}
                    date={date}
                    items={items}
                    onActionDone={reloadAppointments}
                    isHistory={mode === "history"}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </div>

      <AdminServicesModal
        open={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
      />

      <AdminClientsModal
        open={clientsModalOpen}
        onClose={() => setClientsModalOpen(false)}
      />

      <AdminTransferModal
        open={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
      />

      <AdminProductsModal
        open={productsModalOpen}
        onClose={() => setProductsModalOpen(false)}
      />

      {monthlyReportOpen && (
        <MonthlyReportModal onClose={() => setMonthlyReportOpen(false)} />
      )}
    </div>
  );
}

export default AdminPage;