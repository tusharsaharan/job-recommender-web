import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        if (res.data.role === "seeker") {
          navigate("/resume");
        } else {
          navigate("/dashboard");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  return <div className="p-6 text-center">Authenticating...</div>;
}
