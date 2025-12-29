export function calculateMatchScore(userSkills, jobSkills) {
  if (!userSkills.length) return 0;

  let matched = 0;

  for (const skill of userSkills) {
    if (jobSkills.includes(skill)) {
      matched++;
    }
  }

  return Math.round((matched / jobSkills.length) * 100);
}
