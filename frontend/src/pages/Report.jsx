import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../App";

export default function Report() {
  const { reportId } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:3000/v1/user/getReport/${reportId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch report");
        const data = await res.json();
        setReport(data.report);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Could not fetch report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, user]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        ⏳ Loading your report...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );

  if (!report)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        No report found.
      </div>
    );

  const {
    overallScore,
    strengths,
    areasToWorkOn,
    communicationSkills,
    technicalKnowledge,
    quickTips,
    scoresBreakdown,
    answerFeedback,
    lastFeedback,
  } = report;

  return (
    <div className="bg-[#f5f4f0] min-h-screen py-10 px-6 flex flex-col items-center">
      {/* Header */}
      <h1 className="text-4xl font-bold text-[#5c4033] mb-10 text-center">
        🧾 Interview Performance Report
      </h1>

      {/* Overall Score Card */}
      <div className="bg-[#ddd6ca] p-8 rounded-2xl shadow-md text-center w-full max-w-lg mb-10">
        <p
          className={`text-7xl font-bold ${
            Number(overallScore) > 75
              ? "text-green-700"
              : Number(overallScore) >= 50
              ? "text-yellow-700"
              : "text-red-700"
          }`}
        >
          {overallScore}
        </p>
        <p className="text-gray-600 font-medium mt-2 text-lg">Overall Score</p>
      </div>

      {/* Strengths & Areas to Improve */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            💪 Strengths
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-red-700 mb-3">
            ⚙️ Areas to Work On
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {areasToWorkOn.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Communication & Technical */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            🗣️ Communication Skills
          </h2>
          <p className="text-gray-700">{communicationSkills}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-indigo-600 mb-2">
            💻 Technical Knowledge
          </h2>
          <p className="text-gray-700">{technicalKnowledge}</p>
        </div>
      </div>

      {/* Quick Tips & Score Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-amber-600 mb-3">
            ⚡ Quick Tips
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {quickTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-600 mb-3">
            📊 Scores Breakdown
          </h2>
          <div className="space-y-2">
            {Object.entries(scoresBreakdown).map(([key, val], i) => (
              <div key={i} className="flex justify-between text-gray-700">
                <span>{key}</span>
                <span className="font-semibold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Feedback */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-5xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-purple-700 mb-3">
          📝 Answer Feedback
        </h2>
        {answerFeedback.map((feedback, i) => (
          <p
            key={i}
            className="text-gray-700 mb-2 border-b border-gray-100 pb-2 last:border-0"
          >
            {feedback}
          </p>
        ))}
      </div>

      {/* Final Feedback */}
      <div className="bg-[#ddd6ca] border border-gray-300 rounded-xl p-6 w-full max-w-5xl shadow-md">
        <h2 className="text-lg font-semibold text-teal-700 mb-3">
          ✅ Final Feedback
        </h2>
        <p className="text-gray-700">{lastFeedback}</p>
      </div>
    </div>
  );
}