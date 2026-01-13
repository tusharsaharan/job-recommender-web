import { useState } from "react";
import api from "../api";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    console.log("UPLOAD CALLED", file);
    const formData = new FormData();
    formData.append("resume", file);
    await api.post("/resume/upload", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 w-96 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

        <input
          type="file"
          accept=".pdf"
          className="mb-4"
          onChange={(e) => {
            console.log("FILE:", e.target.files[0]);
            setFile(e.target.files[0]);
          }}
        />

        <p className="text-sm mb-2">
          Selected: {file ? file.name : "NONE"}
        </p>

        <button
          onClick={upload}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
