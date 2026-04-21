import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";


export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<any[]>([]);
  const [progress, setProgress] = useState<any | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogout = () => {
    navigate("/");

    setTimeout(() => {
      logout();
    }, 0);
  };

  // =========================
  // Fetch History
  // =========================
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await apiGet("/api/career/history");
      setHistory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingHistory(false);
    }
  };

  // =========================
  // Fetch Progress
  // =========================
  const fetchProgress = async () => {
    try {
      setLoadingProgress(true);
      const data = await apiGet("/api/career/progress");
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchProgress();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <span className="text-xl font-bold text-indigo-600">
            CareerSage
          </span>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-indigo-600 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">

        {/* CARD 1 — Run Analysis */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">
            Run Career Analysis
          </h2>
          <p className="text-gray-600 mb-4">
            Trigger Phase 1–4 AI pipeline and generate recommendations.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Start Analysis
          </button>
        </div>

        {/* CARD 2 — History */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">
            Session History
          </h2>

          {loadingHistory && <p>Loading history...</p>}

          {!loadingHistory && history.length === 0 && (
            <p className="text-gray-600">
              No sessions found yet.
            </p>
          )}

          {!loadingHistory && history.map((session) => (
            <div
              key={session.sessionId}
              className="border-b py-2"
            >
              <p className="font-medium">
                Top Career: {session.topCareer}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(session.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Total Suggestions: {session.totalCareersSuggested}
              </p>
            </div>
          ))}
        </div>

        {/* CARD 3 — Progress */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-3">
            Progress Overview
          </h2>

          {loadingProgress && <p>Loading progress...</p>}

          {!loadingProgress && progress && progress.totalSessions === 0 && (
            <p className="text-gray-600">
              No progress data yet.
            </p>
          )}

          {!loadingProgress && progress && progress.totalSessions > 0 && (
            <div className="space-y-2">
              <p>
                <strong>Total Sessions:</strong>{" "}
                {progress.totalSessions}
              </p>
              <p>
                <strong>Stability:</strong>{" "}
                {progress.careerProgress.stability}
              </p>
              <p>
                <strong>Consistency Score:</strong>{" "}
                {progress.careerProgress.consistencyScore}%
              </p>
              <p>
                <strong>Skill Gap Trend:</strong>{" "}
                {progress.skillGapProgress.trend}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;