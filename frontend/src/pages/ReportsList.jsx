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
        
        // This endpoint should return all reports for the user
        const response = await axios.get(
          `http://localhost:3000/v1/user/getAllReports/${user.userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
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
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '20px' }}>
          ⏳ Loading your reports...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8d7da', 
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <h3>❌ Error Loading Reports</h3>
          <p>{error}</p>
        </div>
        <Link 
          to="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1000px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h1 style={{ 
          color: '#0056b3', 
          marginBottom: '10px'
        }}>
          📋 Your Interview Reports
        </h1>
        <p style={{ fontSize: '16px', color: '#6c757d' }}>
          Review your interview performance and track your progress
        </p>
        <div style={{ 
          display: 'inline-block',
          padding: '5px 15px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
        </div>
      </div>

      {reports.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          border: '2px dashed #dee2e6',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
          <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>
            No Reports Yet
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '30px', maxWidth: '400px', margin: '0 auto' }}>
            You haven't completed any interviews yet. Complete your first interview to see your performance report here.
          </p>
          <Link 
            to="/skill"
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            🎯 Start Your First Interview
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reports.map((report, index) => (
            <div 
              key={report.questionId || index}
              style={{ 
                padding: '25px', 
                backgroundColor: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    Interview Report #{reports.length - index}
                  </h3>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                    Completed on {formatDate(report.createdAt || new Date())}
                  </p>
                  {report.skills && (
                    <div style={{ marginTop: '8px' }}>
                      <strong>Skills:</strong> {report.skills.join(', ')}
                    </div>
                  )}
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: getScoreColor(report.overallScore),
                    lineHeight: '1'
                  }}>
                    {report.overallScore}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    /100
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>
                    {report.strengths?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#0056b3' }}>Strengths</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffc107' }}>
                    {report.areasToWorkOn?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#856404' }}>Areas to Improve</div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '6px' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#dc3545' }}>
                    {report.quickTips?.length || 0}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#721c24' }}>Tips</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <Link 
                  to={`/report/${report.questionId}`}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  📊 View Full Report
                </Link>
                <Link 
                  to="/skill"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  🎯 New Interview
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action */}
      {reports.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#e7f3ff',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#0056b3', marginBottom: '15px' }}>
            Ready for another interview?
          </h3>
          <Link 
            to="/skill"
            style={{
              padding: '12px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            🚀 Start New Interview
          </Link>
        </div>
      )}
    </div>
  );
}