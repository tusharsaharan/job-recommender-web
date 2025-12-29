export function getMatchDetails(userSkills, jobSkills) {
  const matchedSkills = userSkills.filter((skill) =>
    jobSkills.includes(skill)
  );

  const missingSkills = jobSkills.filter(
    (skill) => !userSkills.includes(skill)
  );

  const score =
    jobSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobSkills.length) * 100);

  return {
    score,
    matchedSkills,
    missingSkills,
  };
}
