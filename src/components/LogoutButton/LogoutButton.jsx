// components/Auth/LogoutButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpAuth } from "../../services/httpAuth";

/**
 * LogoutButton
 * - Calls BE: POST /logout via httpAuth
 * - Clears localStorage "username"
 * - Navigates to /login
 * - Shows loading while logging out
 *
 * Props:
 * - className?: string
 * - children?: ReactNode (button label)
 * - onSuccess?: () => void
 * - onError?: (message: string) => void
 */
export default function LogoutButton({ className = "", children = "Logout", onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e?.preventDefault?.();
    if (loading) return;
    setLoading(true);
    try {
      // BE should clear session/cookie
      await httpAuth.post("/auth/logout");
    } catch (err) {
      const be = err?.response?.data;
      const msg = be?.message || err?.message || "Logout failed";
      onError?.(msg);
      // even if BE fails, proceed to clear FE state so user isn't stuck
    } finally {
      try { localStorage.removeItem("username"); } catch {}
      onSuccess?.();
      navigate("/login", { replace: true });
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} className={className} disabled={loading} title="Logout">
      {loading ? "Logging out..." : children}
    </button>
  );
}

