import { useEffect, useState } from "react";
import { adminLogin, adminMe } from "../api/admin.api";

function getStoredAdminToken() {
  return (
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken")
  );
}

function clearStoredAdminToken() {
  localStorage.removeItem("adminToken");
  sessionStorage.removeItem("adminToken");
}

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const token = getStoredAdminToken();

    if (!token) {
      setLoading(false);
      return;
    }

    adminMe()
      .then((data) => {
        setAdmin(data.user);
      })
      .catch(() => {
        clearStoredAdminToken();
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login({ username, password, rememberMe }) {
    setLoginLoading(true);
    setLoginError("");

    try {
      const data = await adminLogin({ username, password });

      clearStoredAdminToken();

      if (rememberMe) {
        localStorage.setItem("adminToken", data.token);
      } else {
        sessionStorage.setItem("adminToken", data.token);
      }

      setAdmin(data.user);
    } catch (err) {
      setLoginError(err.message || "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    clearStoredAdminToken();
    setAdmin(null);
  }

  return {
    admin,
    loading,
    login,
    logout,
    loginError,
    loginLoading,
  };
}