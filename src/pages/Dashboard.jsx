import { useLocation } from "react-router-dom";
import JobCard from "../components/JobCard";
import mockJobs from "../data/mockJobs";
import { getMatchScore } from "../utils/matchScore";

function Dashboard() {
  const location = useLocation();
  const skills = location.state?.skills || [];

  const rankedJobs = mockJobs
    .map((job) => ({
      ...job,
      score: getMatchScore(job.requiredSkills, skills),
      matchedSkills: job.requiredSkills.filter((s) =>
        skills.includes(s)
      ),
      missingSkills: job.requiredSkills.filter(
        (s) => !skills.includes(s)
      ),
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">
          Your Job Matches
        </h1>

        <p className="text-gray-600 mb-8">
          Ranked based on how well your skills match the role
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rankedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
