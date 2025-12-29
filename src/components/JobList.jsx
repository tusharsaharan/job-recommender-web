import JobCard from "./JobCard";

function JobList({ jobs }) {
  if (jobs.length === 0) {
    return <p>No matching jobs found.</p>;
  }

  return (
    <ul>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </ul>
  );
}

export default JobList;
