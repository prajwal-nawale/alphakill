import { useState, useEffect } from "react";
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTranscript = (text) => setAnswer(text);
  const handleFinalTranscript = (text) => setAnswer(text);

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

      setAnswer("");
      if (currentIndex + 1 === totalQuestions) {
        await generateReport();
      } else {
        setCurrentIndex(currentIndex + 1);
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

  const clearAnswer = () => {
    setAnswer("");
    setMessage("");
  };

  const isLastQuestion = currentIndex + 1 === totalQuestions;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f4f0] p-6">
      {/* --- HEADER --- */}
      <div className="bg-[#ddd6ca] w-full max-w-4xl p-6 rounded-xl shadow-md mb-6">
        <h1 className="text-2xl font-bold text-[#4a3f35] mb-2">🧠 Interview Session</h1>
        <div className="flex justify-between text-sm text-gray-700">
          <span>
            <strong>Question:</strong> {currentIndex + 1} of {totalQuestions}
          </span>
          <span>
            <strong>User:</strong> {user?.name}
          </span>
        </div>
      </div>

      {/* --- QUESTION CARD --- */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-xl shadow-md border-l-4 border-[#91b8b6] mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">📝 Question:</h2>
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading question...</p>
        ) : (
          <div className="bg-[#f8f9fa] p-4 rounded-md text-gray-800 text-base min-h-[80px]">
            {question || "No question available."}
          </div>
        )}
      </div>

      {/* --- ANSWER SECTION --- */}
      <div className="bg-[#fefcfb] w-full max-w-4xl p-6 rounded-xl shadow-md border border-[#ddd6ca] mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🎙️ Your Answer:</h3>
        <div className="mb-4">
          <Mic
            onTranscript={handleTranscript}
            onFinalTranscript={handleFinalTranscript}
            showControls={false}
          />
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here or use the microphone above..."
          rows={6}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring focus:ring-[#91b8b6]"
          disabled={isLoading}
        />

        <div
          className={`text-right text-sm mt-2 ${
            answer.length > 1000 ? "text-red-500" : "text-gray-500"
          }`}
        >
          {answer.length}/1000 characters
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={submitAnswer}
            disabled={isLoading || !answer.trim()}
            className={`px-6 py-3 rounded-md text-white font-medium transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : isLastQuestion
                ? "bg-[#91b8b6] hover:bg-[#6ca9a5]"
                : "bg-[#c89a87] hover:bg-[#ab4829]"
            }`}
          >
            {isLoading
              ? "⏳ Processing..."
              : isLastQuestion
              ? "🎯 Finish Interview"
              : "➡️ Submit Answer"}
          </button>

          <button
            onClick={clearAnswer}
            disabled={isLoading || !answer.trim()}
            className={`px-6 py-3 rounded-md font-medium text-white transition ${
              isLoading || !answer.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* --- PROGRESS + MESSAGE --- */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        
        {message && (
          <div
            className={`p-3 rounded-md text-sm font-medium border ${
              message.includes("Error") || message.includes("error")
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {message.includes("Error") ? "❌ " : "✅ "}
            {message}
          </div>
        )}
      </div>

      {/* --- TIPS --- */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 w-full max-w-4xl">
        <h4 className="text-lg font-semibold text-yellow-800 mb-2">💡 Tips:</h4>
        <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
          <li>Speak clearly and at a moderate pace</li>
          <li>You can use the microphone or type your answer</li>
          <li>Answer will auto-submit when you click “Submit Answer”</li>
          <li>You have {totalQuestions} questions in total</li>
        </ul>
      </div>
    </div>
  );
}