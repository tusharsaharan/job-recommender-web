function SkillInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Enter skills (comma separated)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "0.5rem", width: "300px" }}
    />
  );
}

export default SkillInput;
