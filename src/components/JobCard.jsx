function JobCard({ job }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500">
            {job.company}
          </p>
        </div>

        <span className="text-indigo-600 font-bold text-lg">
          {job.score}%
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-1">
        <span className="font-medium">Matched:</span>{" "}
        {job.matchedSkills.length
          ? job.matchedSkills.join(", ")
          : "None"}
      </p>

      <p className="text-sm text-gray-500">
        Missing:{" "}
        {job.missingSkills.length
          ? job.missingSkills.join(", ")
          : "None"}
      </p>
    </div>
  );
}

export default JobCard;
