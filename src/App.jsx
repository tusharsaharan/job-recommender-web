import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import API_BASE from "./api";

export default function App() {
  const [step, setStep] = useState("loading");

  const logout = () => {
    localStorage.removeItem("token");
    setStep("auth");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStep("auth");
      return;
    }

    fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((user) => {
        if (!user.skills || user.skills.length === 0) {
          setStep("onboarding");
        } else {
          setStep("dashboard");
        }
      })
      .catch(() => {
        logout();
      });
  }, []);

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (step === "auth") {
    return <Auth onAuth={() => setStep("onboarding")} />;
  }

  if (step === "onboarding") {
    return <Onboarding onDone={() => setStep("dashboard")} />;
  }

  return <Dashboard onLogout={logout} />;
}
