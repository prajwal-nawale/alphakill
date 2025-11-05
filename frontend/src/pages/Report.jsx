import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';

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
        Loading report...
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
    lastFeedback
  } = report;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
        Interview Report
      </h1>

      {/* Overall Score */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6  transition-all duration-300">
        <h2 className="text-xl font-semibold text-red-500 border-b pb-2 mb-3">
          Overall Score
        </h2>
        <p className="text-gray-700 text-lg">{overallScore}</p>
      </div>

      {/* Strengths */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Strengths
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Areas to Work On */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Areas to Work On
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {areasToWorkOn.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      {/* Communication Skills */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Communication Skills
        </h2>
        <p className="text-gray-700">{communicationSkills}</p>
      </div>

      {/* Technical Knowledge */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Technical Knowledge
        </h2>
        <p className="text-gray-700">{technicalKnowledge}</p>
      </div>

      {/* Quick Tips */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Quick Tips
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {quickTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Scores Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Scores Breakdown
        </h2>
        {Object.entries(scoresBreakdown).map(([key, val], i) => (
          <p key={i} className="text-gray-700">
            <strong className="text-gray-900">{key}:</strong> {val}
          </p>
        ))}
      </div>

      {/* Answer Feedback */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Answer Feedback
        </h2>
        {answerFeedback.map((feedback, i) => (
          <p key={i} className="text-gray-700 mb-2">
            {feedback}
          </p>
        ))}
      </div>

      {/* Final Feedback */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <h2 className="text-xl font-semibold text-blue-600 border-b pb-2 mb-3">
          Final Feedback
        </h2>
        <p className="text-gray-700">{lastFeedback}</p>
      </div>
    </div>
  );
}