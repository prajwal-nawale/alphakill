import { useState } from "react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mic from "../components/Mic";

export default function Skill() {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTranscript = (text) => setCurrentInput(text);

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setMessage("Please select a file first.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("userId", user.userId);

      const res = await fetch("http://localhost:3000/v1/user/uploadResume", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSkills(data.extractedSkills);
        setMessage("✅ Skills extracted from resume successfully!");
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsUpdate = (newSkillText) => {
    const newSkills = newSkillText
      .split(/[,.\n]+/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    setSkills((prev) => [...new Set([...prev, ...newSkills])]);
    setCurrentInput("");
  };

  const handleManualAdd = () => {
    if (currentInput.trim()) {
      const newSkills = currentInput
        .split(/[,.\n]+/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      setSkills((prev) => [...new Set([...prev, ...newSkills])]);
      setCurrentInput("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllSkills = () => {
    setSkills([]);
    setCurrentInput("");
    setMessage("");
  };

  const handleSkillSubmit = async () => {
    if (skills.length === 0) {
      setMessage("Please add at least one skill before submitting");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const skillsText = skills.join(", ");

      await axios.post(
        "http://localhost:3000/v1/user/addInputSkill",
        { userId: user.userId, input: skillsText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const response = await axios.post(
        "http://localhost:3000/v1/user/aiQuestionGeneration",
        { userId: user.userId, finalInput: skillsText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "Questions generated successfully!");
      setTimeout(() => navigate("/interview"), 1500);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Failed to generate questions. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#f5f4f0] min-h-screen">
      {/* --- TOP SECTION: Upload + Voice Input --- */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl justify-center mb-8">
        {/* Upload Resume */}
        <div className="bg-[#ddd6ca] p-6 rounded-xl shadow-md w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-3">
            📄 Upload Resume (PDF)
          </h3>
          <input
            type="file"
            accept=".pdf, .png, .jpg, .jpeg"
            onChange={(e) => setResumeFile(e.target.files[0])}
            className="mb-4 block w-full text-gray-700 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
          <button
            onClick={handleResumeUpload}
            disabled={loading || !resumeFile}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition ${
              resumeFile
                ? "bg-[#c89a87] hover:bg-[#ab4829]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "⏳ Extracting..." : "Upload and Extract Skills"}
          </button>
        </div>

        {/* Voice Input */}
        <div className="bg-[#ddd6ca] p-6 rounded-xl shadow-md w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-3">
            🎤 Voice Input
          </h3>
          <p className="text-gray-600 mb-4 text-sm">
            <strong>Tip:</strong> Say skills one by one, like "JavaScript",
            "React", "Node.js". Click “Add to Skills” after each group.
          </p>
          <Mic onTranscript={handleTranscript} onSkillsUpdate={handleSkillsUpdate} />
        </div>
      </div>

      {/* --- Manual Input Section --- */}
      <div className="bg-[#f8f9fa] p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
        <h3 className="text-lg font-semibold mb-3">⌨️ Type Skills:</h3>
        <div className="flex gap-3 mb-2">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type skills (separate with commas): JavaScript, React, Node.js"
            className="flex-1 border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
            onKeyPress={(e) => e.key === "Enter" && handleManualAdd()}
          />
          <button
            onClick={handleManualAdd}
            disabled={!currentInput.trim()}
            className={`px-4 py-2 rounded-md text-white font-medium transition ${
              currentInput.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add Skill
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Separate multiple skills with commas: "JavaScript, React, Node.js"
        </p>
      </div>

      {/* --- Display Skills --- */}
      {skills.length > 0 && (
        <div className="bg-[#ddd6ca] p-6 rounded-xl shadow-md w-full max-w-3xl mb-8">
          <h3 className="text-lg font-semibold text-gray-700">
            ✅ Your Skills ({skills.length})
          </h3>
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-[#91b8b6] text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={clearAllSkills}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition"
          >
            🗑️ Clear All Skills
          </button>
        </div>
      )}

      {/* --- Generate Questions Button --- */}
      <div className="text-center mb-8">
        <button
          onClick={handleSkillSubmit}
          disabled={loading || skills.length === 0}
          className={`py-3 px-6 rounded-md text-white font-semibold text-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : skills.length > 0
              ? "bg-[#b5c6bf] hover:bg-[#91b8b6]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading
            ? "⏳ Generating Questions..."
            : `🚀 Generate Questions (${skills.length} skills)`}
        </button>
      </div>

      {/* --- Message --- */}
      {message && (
        <div
          className={`w-full max-w-3xl p-4 rounded-md text-center font-medium ${
            message.includes("successfully")
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* --- Tips Section --- */}
      <div className="bg-yellow-100 border border-yellow-200 rounded-xl p-6 w-full max-w-3xl mt-8">
        <h4 className="text-lg font-semibold mb-2">💡 How to use:</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
          <li>Click "Start Speaking" and say one skill at a time</li>
          <li>Click "Add to Skills" after each group of skills</li>
          <li>Use typing for specific technology names</li>
          <li>Review your skills list above</li>
          <li>Click "Generate Questions" when ready</li>
        </ol>
      </div>
    </div>
  );
}