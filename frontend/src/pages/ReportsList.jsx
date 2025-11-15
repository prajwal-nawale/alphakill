import { useState, useEffect } from "react";
import { useAuth } from '../App';
import { Link } from "react-router-dom";
import axios from "axios";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get(
          "http://localhost:3000/v1/user/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        
        setReports(response.data.reports || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.response?.data?.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReports();
    }
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <div className="text-lg text-gray-600">Loading your reports...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 border border-red-300 rounded-2xl p-6 mb-6">
            <div className="text-red-600 text-4xl mb-3">❌</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reports</h3>
            <p className="text-red-700">{error}</p>
          </div>
          <Link 
            to="/"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📋 Interview Reports
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Review your interview performance and track your progress
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              {reports.length} {reports.length === 1 ? 'Report' : 'Reports'} Found
            </span>
          </div>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No Reports Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't completed any interviews yet. Complete your first interview to see your performance report here.
            </p>
            <Link 
              to="/skill"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              🎯 Start Your First Interview
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report, index) => {
              const reportId = report._id || report.reportId;
              
              return (
                <div 
                  key={reportId || index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                    {/* Report Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 text-red-600 rounded-lg p-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Interview Report #{reports.length - index}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Completed on {formatDate(report.createdAt || new Date())}
                          </p>
                        </div>
                      </div>
                      
                      {report.skills && report.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {report.skills.slice(0, 4).map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {report.skills.length > 4 && (
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                              +{report.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Score */}
                    <div className="flex flex-col items-center">
                      <div className={`border-2 rounded-2xl p-4 text-center min-w-[120px] ${getScoreBgColor(report.overallScore)}`}>
                        <div className={`text-3xl font-bold ${getScoreColor(report.overallScore)}`}>
                          {report.overallScore}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Overall Score</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {report.strengths?.length || 0}
                      </div>
                      <div className="text-sm font-medium text-green-700">Strengths</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {report.areasToWorkOn?.length || 0}
                      </div>
                      <div className="text-sm font-medium text-yellow-700">Areas to Improve</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Link 
                      to={`/report/${reportId}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Full Report
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Action */}
        {reports.length > 0 && (
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready for another interview?
              </h3>
              <Link 
                to="/skill"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🚀 Start New Interview
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}