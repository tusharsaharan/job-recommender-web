function JobCard({ job }) {
  return (
    <li>
      <strong>{job.title}</strong> @ {job.company} — Match: {job.score}%
      <br />
      <small>
        Matched: {job.matchedSkills.join(", ") || "None"} <br />
        Missing: {job.missingSkills.join(", ")}
      </small>
    </li>
  );
}

export default JobCard;
