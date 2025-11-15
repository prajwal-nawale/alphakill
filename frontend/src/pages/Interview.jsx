import { useState, useEffect, useRef } from "react";
import { useAuth } from "../App";
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
  const [totalQuestions] = useState(10);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Create a ref to access the Mic component's clear function
  const micRef = useRef(null);

  const handleTranscript = (text) => setVoiceTranscript(text);
  
  const handleFinalTranscript = (text) => {
    setVoiceTranscript(text);
    setAnswer(prev => prev + (prev ? " " : "") + text);
  };

  // Clear the Mic component's internal state
  const clearVoiceTranscript = () => {
    setVoiceTranscript("");
    // If the Mic component has a clear method, call it
    if (micRef.current && micRef.current.clearSession) {
      micRef.current.clearSession();
    }
  };

  const clearAll = () => {
    setAnswer("");
    setVoiceTranscript("");
    setMessage("");
    // Also clear the Mic component's internal state
    if (micRef.current && micRef.current.clearSession) {
      micRef.current.clearSession();
    }
  };

  useEffect(() => {
    if (currentIndex < totalQuestions) {
      fetchInterviewQuestion();
      // Clear everything when question changes
      setAnswer("");
      setVoiceTranscript("");
      setMessage("");
      // Also clear the Mic component's internal state
      if (micRef.current && micRef.current.clearSession) {
        micRef.current.clearSession();
      }
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

      setAnswer("");
      setVoiceTranscript("");
      if (currentIndex + 1 === totalQuestions) {
        await generateReport();
      } else {
        setCurrentIndex(currentIndex + 1);
        if (micRef.current && micRef.current.clearSession) {
          micRef.current.clearSession();
}
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

      setMessage("Interview completed! Generating report...");
      const reportId = response.data.reportId;

      if (reportId && reportId !== "undefined") {
        setTimeout(() => {
          navigate(`/report/${reportId}`);
        }, 2000);
      } else {
        setMessage("Error: Could not generate report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setMessage("Error generating report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isLastQuestion = currentIndex + 1 === totalQuestions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Interview Session
          </h1>
          <div className="flex justify-center items-center gap-6 text-lg text-gray-600">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
              <span className="font-semibold text-red-600">Question:</span> {currentIndex + 1} of {totalQuestions}
            </div>
            <div className="bg-white px-4 py-1 rounded-xl shadow-sm border border-gray-200">
              <span className="font-semibold text-red-600">User:</span> {user?.name}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 py-2 mb-3">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-red-600">{currentIndex + 1}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 text-red-600 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Interview Question</h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <p className="text-gray-500 mt-2">Loading question...</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 min-h-[50px]">
              <p className="text-lg text-gray-800 leading-relaxed">
                {question || "No question available."}
              </p>
            </div>
          )}
        </div>

        {/* Answer Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 text-green-600 rounded-lg p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Your Answer</h2>
          </div>

          {/* Voice Input Section */}
          <div className="mb-1">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">🎤 Voice Input</h3>
              
              {/* Voice Transcript Display */}
              <div className="mb-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Transcript:</p>
                <div className="min-h-20 p-4 bg-white rounded-lg border border-gray-300">
                  {voiceTranscript ? (
                    <p className="text-gray-900 text-lg">{voiceTranscript}</p>
                  ) : (
                    <p className="text-gray-500 italic">Speak to see transcript here...</p>
                  )}
                </div>
              </div>

              {/* Mic and Clear buttons */}
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 rounded-xl py-4">
                  <Mic 
                    ref={micRef}
                    onTranscript={handleTranscript} 
                    onFinalTranscript={handleFinalTranscript}
                    showControls={true} // This enables the internal Clear button
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="mb-1">
            <label className="block text-lg font-semibold text-gray-700 mt-3 mb-3">✏️ Type Your Answer:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here or use the microphone above. Voice input will be automatically added to this field."
              rows={7}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 resize-none"
              disabled={isLoading}
            />
            <div className={`text-right text-sm mt-2 ${answer.length > 1000 ? "text-red-500" : "text-gray-500"}`}>
              {answer.length}/1000 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={submitAnswer}
              disabled={isLoading || !answer.trim()}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : isLastQuestion
                  ? "bg-gradient-to-r from-green-600 to-green-700 shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading
                ? "⏳ Processing..."
                : isLastQuestion
                ? "🎯 Finish Interview & Generate Report"
                : "➡️ Submit Answer & Next Question"}
            </button>

            <button
              onClick={clearAll}
              disabled={isLoading || (!answer.trim() && !voiceTranscript)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                isLoading || (!answer.trim() && !voiceTranscript)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`w-full p-6 rounded-2xl text-center font-semibold text-lg mb-8 transition-all duration-300 ${
              message.includes("Error") || message.includes("error")
                ? "bg-red-100 text-red-800 border border-red-300 shadow-md"
                : "bg-green-100 text-green-800 border border-green-300 shadow-md"
            }`}
          >
            {message.includes("Error") ? "❌ " : "✅ "}
            {message}
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            💡 Interview Tips
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">1</div>
              <p><strong>Use the Clear button</strong> in the voice input section to reset the transcript</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">2</div>
              <p><strong>Speak clearly</strong> and at a moderate pace for better voice recognition</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">3</div>
              <p><strong>Use "Clear All"</strong> to reset both voice and text inputs completely</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2">4</div>
              <p><strong>Combine methods</strong> - use voice for quick input and typing for precision</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}