import { useEffect, useState } from "react";
import API_BASE from "../api";

export default function Dashboard({ onLogout }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/jobs/match`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setJobs);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recommended Jobs</h1>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {jobs.length === 0 && <p>No matches yet</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-gray-600">
              {job.company} · {job.location}
            </p>

            <p className="mt-3 font-medium">
              Match Score: {job.score}%
            </p>

            <p className="text-sm mt-2">
              Matched: {job.matchedSkills.join(", ")}
            </p>

            <p className="text-sm text-gray-500">
              Missing: {job.missingSkills.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
