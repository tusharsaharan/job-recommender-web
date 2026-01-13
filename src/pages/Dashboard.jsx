import { useEffect, useState } from "react";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((res) => {
      setUser(res.data);

      if (res.data.role === "seeker") {
        api.get("/jobs/match").then((r) => setJobs(r.data));
      } else {
        api.get("/jobs").then((r) => setJobs(r.data.jobs || r.data));
      }
    });
  }, []);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between">
        <h1 className="font-bold text-xl">
          {user.role === "recruiter" ? "Recruiter Dashboard" : "Job Matches"}
        </h1>
        <button
          className="text-red-600"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold text-lg">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.company}</p>

            {user.role === "seeker" && (
              <button
                disabled={loadingId === job._id}
                onClick={async () => {
                  setLoadingId(job._id);
                  await api.post(`/applications/${job._id}`);
                  setLoadingId(null);
                }}
                className="mt-4 w-full bg-indigo-600 text-white py-1.5 rounded disabled:opacity-50"
              >
                {loadingId === job._id ? "Applying..." : "Apply"}
              </button>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
