import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  const addSkill = () => {
    const value = input.trim().toLowerCase();
    if (!value || skills.includes(value)) return;
    setSkills([...skills, value]);
    setInput("");
  };

  const skillCount = skills.length;
  const progress = Math.min(skillCount * 20, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold mb-2">
          Build your profile
        </h1>

        <p className="text-gray-500 mb-6">
          Add your skills to get better job matches
        </p>

        <div className="flex gap-3 mb-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSkill()}
            placeholder="e.g. react, javascript, node"
            className="
              flex-1
              border border-gray-300
              rounded-lg px-4 py-2
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500
            "
          />

          <button
            onClick={addSkill}
            className="
              bg-indigo-600 text-white
              px-5 rounded-lg
              font-medium
              hover:bg-indigo-700
              active:scale-95
              transition
            "
          >
            Add
          </button>
        </div>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.map((skill) => (
              <span
                key={skill}
                className="
                  bg-indigo-100 text-indigo-700
                  px-3 py-1 rounded-full
                  text-sm font-medium
                "
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Profile strength</span>
            <span>{skillCount} skills</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          disabled={skillCount === 0}
          onClick={() =>
            navigate("/dashboard", { state: { skills } })
          }
          className="
            w-full
            bg-indigo-600 text-white
            py-3 rounded-lg
            font-medium
            hover:bg-indigo-700
            active:scale-95
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Continue →
        </button>

      </div>
    </div>
  );
}

export default Onboarding;
