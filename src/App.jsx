import { jobs } from "./data/mockJobs";
import { calculateMatchScore } from "./utils/matchScore";

function App() {
  const userSkills = ["react", "javascript"];

  const rankedJobs = jobs
    .map((job) => ({
      ...job,
      score: calculateMatchScore(userSkills, job.skills),
    }))
    .filter((job) => job.score > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job Recommender</h1>

      <h2>Your skills:</h2>
      <p>{userSkills.join(", ")}</p>

      <h2>Recommended jobs:</h2>

      {rankedJobs.length === 0 ? (
        <p>No matching jobs found.</p>
      ) : (
        <ul>
          {rankedJobs.map((job) => (
            <li key={job.id}>
              <strong>{job.title}</strong> @ {job.company} — Match:{" "}
              {job.score}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
