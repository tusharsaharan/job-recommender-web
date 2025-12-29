import { useState } from "react";
import { jobs } from "./data/mockJobs";
import { getMatchDetails } from "./utils/matchScore";
import SkillInput from "./components/SkillInput";
import JobList from "./components/JobList";

function App() {
  const [skillInput, setSkillInput] = useState("");

  const userSkills = skillInput
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const rankedJobs = jobs
    .map((job) => {
      const details = getMatchDetails(userSkills, job.skills);
      return { ...job, ...details };
    })
    .filter((job) => job.score > 0)
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Job Recommender</h1>

      <SkillInput value={skillInput} onChange={setSkillInput} />

      <JobList jobs={rankedJobs} />
    </div>
  );
}

export default App;
