import { useEffect, useState } from "react";
import { adminLogin, adminMe } from "../api/admin.api";

export function useAdminAuth() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setLoading(false);
      return;
    }

    adminMe()
      .then((data) => {
        setAdmin(data.user);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  async function login({ username, password }) {
    setLoginLoading(true);
    setLoginError("");

    try {
      const data = await adminLogin({ username, password });

      localStorage.setItem("adminToken", data.token);
      setAdmin(data.user);
    } catch (err) {
      setLoginError(err.message || "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("adminToken");
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