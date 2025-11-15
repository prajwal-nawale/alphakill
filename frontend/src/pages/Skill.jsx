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
  const [activeTab, setActiveTab] = useState("resume"); // "resume" | "voice" | "manual"
  const [voiceTranscript, setVoiceTranscript] = useState(""); // New state for voice input
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTranscript = (text) => setVoiceTranscript(text);

  const handleVoiceAdd = () => {
    if (voiceTranscript.trim()) {
      const newSkills = voiceTranscript
        .split(/[,.\n]+/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      setSkills((prev) => [...new Set([...prev, ...newSkills])]);
      setVoiceTranscript("");
      setMessage("✅ Skills added from voice input!");
    }
  };

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
    setVoiceTranscript("");
  };

  const handleManualAdd = () => {
    if (currentInput.trim()) {
      const newSkills = currentInput
        .split(/[,.\n]+/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      setSkills((prev) => [...new Set([...prev, ...newSkills])]);
      setCurrentInput("");
      setMessage("✅ Skills added successfully!");
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllSkills = () => {
    setSkills([]);
    setCurrentInput("");
    setVoiceTranscript("");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Add Your Skills
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your preferred method to add skills. You can upload a resume, use voice input, or type them manually.
          </p>
        </div>

        {/* Tab Navigation - Updated Order: Resume → Voice → Type */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-8">
          {["resume", "voice", "manual"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab === "resume" && "📄 Resume"}
              {tab === "voice" && "🎤 Voice"}
              {tab === "manual" && "⌨️ Type"}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          {/* Resume Upload Tab - Now First */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Resume</h3>
                <p className="text-gray-600">We'll automatically extract skills from your resume</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors duration-200">
                <input
                  type="file"
                  accept=".pdf, .png, .jpg, .jpeg"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-4xl mb-4">📄</div>
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    {resumeFile ? resumeFile.name : "Choose resume file"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supports PDF, PNG, JPG (Max 5MB)
                  </p>
                </label>
              </div>
              
              <button
                onClick={handleResumeUpload}
                disabled={loading || !resumeFile}
                className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                  resumeFile && !loading
                    ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "⏳ Extracting Skills..." : "Extract Skills from Resume"}
              </button>
            </div>
          )}

          {/* Voice Input Tab - Now Second */}
          {activeTab === "voice" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Voice Input</h3>
                <p className="text-gray-600">Speak your skills one by one clearly</p>
              </div>
              
              {/* Voice Transcript Display */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Transcript:</p>
                <div className="min-h-20 p-4 bg-white rounded-lg border border-gray-300">
                  {voiceTranscript ? (
                    <p className="text-gray-900 text-lg">{voiceTranscript}</p>
                  ) : (
                    <p className="text-gray-500 italic">Speak to see transcript here...</p>
                  )}
                </div>
              </div>

              {/* Add Button for Voice Input */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl p-6">
                  <Mic onTranscript={handleTranscript} onSkillsUpdate={handleSkillsUpdate} />
                </div>
                <button
                  onClick={handleVoiceAdd}
                  disabled={!voiceTranscript.trim()}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                    voiceTranscript.trim()
                      ? "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Skills
                </button>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 text-sm font-medium">
                  💡 <strong>Tip:</strong> Say skills clearly like "JavaScript", "React", "Node.js". 
                  Click "Add to Skills" after speaking to add them to your skill list.
                </p>
              </div>
            </div>
          )}

          {/* Manual Input Tab - Now Third */}
          {activeTab === "manual" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Type Your Skills</h3>
                <p className="text-gray-600">Separate multiple skills with commas</p>
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js, Python"
                  className="flex-1 border border-gray-300 rounded-xl p-4 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500"
                  onKeyPress={(e) => e.key === "Enter" && handleManualAdd()}
                />
                <button
                  onClick={handleManualAdd}
                  disabled={!currentInput.trim()}
                  className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                    currentInput.trim()
                      ? "bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skills Display */}
        {skills.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Your Skills <span className="text-red-600">({skills.length})</span>
              </h3>
              <button
                onClick={clearAllSkills}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 transition-colors duration-200"
              >
                🗑️ Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group"
                >
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-white hover:text-gray-200 transition-colors duration-200 text-lg font-bold group-hover:scale-110"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Questions Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSkillSubmit}
            disabled={loading || skills.length === 0}
            className={`py-4 px-12 rounded-xl font-bold text-lg text-white transition-all duration-200 transform hover:scale-105 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : skills.length > 0
                ? "bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading
              ? "⏳ Generating Questions..."
              : `🚀 Generate Interview Questions (${skills.length} skills)`}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`w-full p-6 rounded-xl text-center font-semibold text-lg mb-8 transition-all duration-300 ${
              message.includes("successfully") || message.includes("✅")
                ? "bg-green-100 text-green-800 border border-green-300 shadow-md"
                : "bg-red-100 text-red-800 border border-red-300 shadow-md"
            }`}
          >
            {message}
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💡 Quick Tips
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">1</div>
              <p><strong>Start with Resume:</strong> Upload your resume for automatic skill extraction</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">2</div>
              <p><strong>Use Voice Input:</strong> Quickly add additional skills by speaking</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">3</div>
              <p><strong>Fine-tune with Type:</strong> Manually add specific skills or make corrections</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">4</div>
              <p>Include both technical and soft skills for comprehensive interview preparation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}