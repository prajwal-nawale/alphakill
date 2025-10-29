import { useState } from "react";
import { useAuth } from '../App';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mic from "../components/Mic";

export default function Skill() {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]); // Array to store multiple skills
  const [currentInput, setCurrentInput] = useState(""); // For manual typing
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTranscript = (text) => {
    // This is for real-time display during speaking
    setCurrentInput(text);
  };

  const handleSkillsUpdate = (newSkillText) => {
    // Process the spoken text and extract individual skills
    const newSkills = newSkillText
      .split(/[,.\n]+/) // Split by commas, periods, or newlines
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    setSkills(prev => {
      const combined = [...prev, ...newSkills];
      // Remove duplicates
      return [...new Set(combined)];
    });
    
    setCurrentInput(""); // Clear current input after adding to skills
  };

  const handleManualAdd = () => {
    if (currentInput.trim()) {
      const newSkills = currentInput
        .split(/[,.\n]+/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      setSkills(prev => {
        const combined = [...prev, ...newSkills];
        return [...new Set(combined)];
      });
      setCurrentInput("");
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills(prev => prev.filter((_, index) => index !== indexToRemove));
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

      // Step 1: Save the skills input
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

      // Step 2: Generate AI-based questions
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

      // Step 3: Navigate to home
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Failed to generate questions. Try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Add Your Skills for Interview Preparation</h2>
      <p>Add skills one by one using voice or typing. You can add multiple skills!</p>
      
      {/* Voice Input Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🎤 Voice Input (Recommended):</h3>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          <strong>Tip:</strong> Say skills one by one, like "JavaScript", then "React", then "Node.js". 
          Click "Add to Skills" after each group.
        </p>
        <Mic 
          onTranscript={handleTranscript} 
          onSkillsUpdate={handleSkillsUpdate}
        />
      </div>

      {/* Manual Input Section */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>⌨️ Type Skills:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type skills (separate with commas): JavaScript, React, Node.js"
            style={{ 
              flex: 1,
              padding: '10px', 
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualAdd();
              }
            }}
          />
          <button 
            onClick={handleManualAdd}
            disabled={!currentInput.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: currentInput.trim() ? '#007bff' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentInput.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Add Skill
          </button>
        </div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Separate multiple skills with commas: "JavaScript, React, Node.js"
        </p>
      </div>

      {/* Skills Display */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
          <h3>✅ Your Skills ({skills.length}):</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
            {skills.map((skill, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <button 
            onClick={clearAllSkills}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear All Skills
          </button>
        </div>
      )}

      {/* Submit Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={handleSkillSubmit} 
          disabled={loading || skills.length === 0}
          style={{
            padding: '15px 30px',
            backgroundColor: loading ? '#ccc' : (skills.length > 0 ? '#28a745' : '#ccc'),
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || skills.length === 0) ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold'
          }}
        >
          {loading ? "⏳ Generating Questions..." : `🚀 Generate Questions (${skills.length} skills)`}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          fontSize: '16px'
        }}>
          {message.includes('successfully') ? '✅ ' : '❌ '}
          {message}
        </div>
      )}

      {/* Tips */}
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h4>💡 How to use:</h4>
        <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
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