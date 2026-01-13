import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Onboarding() {
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    const skillArray = skills
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    await api.patch("/users/skills", { skills: skillArray });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Tell us your skills</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter skills separated by commas
        </p>

        <textarea
          className="w-full border rounded p-3 mb-6"
          rows="4"
          placeholder="react, node, sql, python"
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
