import { useState, useEffect } from "react";
import { useAuth } from '../App';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mic from "../components/Mic";

export default function Interview() {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionId, setQuestionId] = useState("");
  const [totalQuestions] = useState(10); // You can make this dynamic
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle real-time transcript
  const handleTranscript = (text) => {
    setAnswer(text);
  };

  // Handle final transcript when mic stops
  const handleFinalTranscript = (text) => {
    setAnswer(text);
  };

  // Fetch question when index changes
  useEffect(() => {
    if (currentIndex < totalQuestions) {
      fetchInterviewQuestion();
    }
  }, [currentIndex]);

  const fetchInterviewQuestion = async () => {
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/v1/user/getQuestions/${user.userId}/${currentIndex}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setQuestion(response.data.question);
      setQuestionId(response.data.questionId);
      setMessage("");
    } catch (error) {
      console.error("Error fetching interview question:", error);
      setMessage(error.response?.data?.message || "Error fetching question.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    const token = localStorage.getItem("token");

    if (!answer.trim()) {
      setMessage("Please provide an answer before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/v1/user/submitAnswer",
        {
          userId: user.userId,
          questionId,
          index: currentIndex,
          answer: answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAnswer(""); // Clear answer for next question

      // If last question, generate report
      if (currentIndex + 1 === totalQuestions) {
        await generateReport();
      } else {
        setCurrentIndex(currentIndex + 1); // Go to next question
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setMessage("Error submitting answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async () => {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3000/v1/user/generateReport",
        { userId: user.userId, questionId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Report generated:", response.data);
      setMessage("Interview completed! Generating report...");

      // Navigate to report page
      setTimeout(() => {
        //navigate(`/report/${user.userId}/${questionId}`);
        navigate("/")
      }, 2000);

    } catch (error) {
      console.error("Error generating report:", error);
      setMessage("Error generating report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearAnswer = () => {
    setAnswer("");
    setMessage("");
  };

  const isLastQuestion = currentIndex + 1 === totalQuestions;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#e7f3ff', 
        borderRadius: '8px',
        border: '1px solid #b3d9ff'
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>Interview Session</h1>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '16px'
        }}>
          <span><strong>Question:</strong> {currentIndex + 1} of {totalQuestions}</span>
          <span><strong>User:</strong> {user?.name}</span>
        </div>
      </div>

      {/* Question Card */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        backgroundColor: 'white',
        border: '2px solid #007bff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>Question:</h2>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading question...</p>
          </div>
        ) : (
          <div style={{ 
            fontSize: '18px', 
            lineHeight: '1.6',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            minHeight: '80px'
          }}>
            {question || "No question available."}
          </div>
        )}
      </div>

      {/* Answer Section */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '25px', 
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Your Answer:</h3>
        
        {/* Mic Component - No controls for interview */}
        <div style={{ marginBottom: '20px' }}>
          <Mic 
            onTranscript={handleTranscript}
            onFinalTranscript={handleFinalTranscript}
            showControls={false}
          />
        </div>

        {/* Text Input */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here or use the microphone above..."
          rows={6}
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '16px',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontFamily: 'Arial, sans-serif',
            resize: 'vertical'
          }}
          disabled={isLoading}
        />

        {/* Character Count */}
        <div style={{ 
          textAlign: 'right', 
          color: answer.length > 1000 ? '#dc3545' : '#6c757d',
          marginTop: '5px',
          fontSize: '14px'
        }}>
          {answer.length}/1000 characters
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginTop: '20px',
          justifyContent: 'center'
        }}>
          <button 
            onClick={submitAnswer} 
            disabled={isLoading || !answer.trim()}
            style={{
              padding: '12px 30px',
              backgroundColor: isLoading ? '#ccc' : (isLastQuestion ? '#28a745' : '#007bff'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (isLoading || !answer.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              minWidth: '200px'
            }}
          >
            {isLoading ? "⏳ Processing..." : (isLastQuestion ? "🎯 Finish Interview" : "➡️ Submit Answer")}
          </button>

          <button 
            onClick={clearAnswer}
            disabled={isLoading || !answer.trim()}
            style={{
              padding: '12px 20px',
              backgroundColor: (isLoading || !answer.trim()) ? '#ccc' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (isLoading || !answer.trim()) ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Progress and Message */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          Progress: {currentIndex}/{totalQuestions} questions completed
        </div>
        
        {message && (
          <div style={{ 
            padding: '12px 20px',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
            borderRadius: '4px',
            color: message.includes('Error') ? '#721c24' : '#155724',
            fontSize: '14px'
          }}>
            {message.includes('Error') ? '❌ ' : '✅ '}
            {message}
          </div>
        )}
      </div>

      {/* Tips */}
      <div style={{ 
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>💡 Tips:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#856404' }}>
          <li>Speak clearly and at a moderate pace</li>
          <li>You can use the microphone or type your answer</li>
          <li>Answer will auto-submit when you click "Submit Answer"</li>
          <li>You have {totalQuestions} questions in total</li>
        </ul>
      </div>
    </div>
  );
}