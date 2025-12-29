export function getMatchScore(requiredSkills, userSkills) {
  if (requiredSkills.length === 0) return 0;

  const matched = requiredSkills.filter((skill) =>
    userSkills.includes(skill)
  ).length;

  return Math.round((matched / requiredSkills.length) * 100);
}
