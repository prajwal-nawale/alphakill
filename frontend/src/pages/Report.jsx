import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../App';
import './report.css';

export default function Report() {
  const { id } = useParams();
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:3000/v1/user/getReport/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch report");
        }

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
  }, [id, user]);

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>{error}</div>;
  if (!report) return <div>No report found.</div>;

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
    <div className="report-container">
      <h1>Interview Report</h1>

      <div className="card">
        <h2>Overall Score</h2>
        <p>{overallScore}</p>
      </div>

      <div className="card">
        <h2>Strengths</h2>
        <ul>
          {strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>

      <div className="card">
        <h2>Areas to Work On</h2>
        <ul>
          {areasToWorkOn.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </div>

      <div className="card">
        <h2>Communication Skills</h2>
        <p>{communicationSkills}</p>
      </div>

      <div className="card">
        <h2>Technical Knowledge</h2>
        <p>{technicalKnowledge}</p>
      </div>

      <div className="card">
        <h2>Quick Tips</h2>
        <ul>
          {quickTips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>
      </div>

      <div className="card">
        <h2>Scores Breakdown</h2>
        {Object.entries(scoresBreakdown).map(([key, val], i) => (
          <p key={i}><strong>{key}:</strong> {val}</p>
        ))}
      </div>

      <div className="card">
        <h2>Answer Feedback</h2>
        {answerFeedback.map((feedback, i) => (
          <p key={i}>{feedback}</p>
        ))}
      </div>

      <div className="card">
        <h2>Final Feedback</h2>
        <p>{lastFeedback}</p>
      </div>
    </div>
  );
}