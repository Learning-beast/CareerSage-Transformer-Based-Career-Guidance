import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  //this is for "controls" toggle view
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  //new additions:
  //1) this one is for preparing data for chart
  const chartData = stats?.sessionsOverTime?.map((item: any) => ({
    date: item._id,
    sessions: item.count,
  }));

  //2) this one is for toggle view between "stats" & "controls"
  const [activeTab, setActiveTab] = useState<"stats" | "controls">(
    (localStorage.getItem("adminTab") as "stats" | "controls") || "stats",
  );

  const fetchStats = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await fetch("http://localhost:3001/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await fetch("http://localhost:3001/api/admin/users", {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  //this let's us be on the same tab after refresh as we were on before refresh:
  useEffect(() => {
    localStorage.setItem("adminTab", activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    navigate("/");

    setTimeout(() => {
      logout();
    }, 0);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      // Remove user from UI instantly
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      
      // 🔥 Refresh stats after delete
      fetchStats();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-700 text-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6">
        <h1 className="text-xl font-semibold">CareerSage Admin</h1>

        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-indigo-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/*new Addition */}
      <div className="px-8 pb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded ${
            activeTab === "stats"
              ? "bg-white text-indigo-700"
              : "bg-indigo-700 text-white"
          }`}
        >
          Stats
        </button>

        <button
          onClick={() => setActiveTab("controls")}
          className={`px-4 py-2 rounded ${
            activeTab === "controls"
              ? "bg-white text-indigo-700"
              : "bg-indigo-700 text-white"
          }`}
        >
          Controls
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {activeTab === "stats" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Platform Stats</h2>

            {loadingStats ? (
              <p>Loading stats...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Total Users</h3>
                  <p className="text-2xl font-bold">{stats?.totalUsers}</p>
                </div>

                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Total Sessions</h3>
                  <p className="text-2xl font-bold">{stats?.totalSessions}</p>
                </div>

                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold">Avg Sessions/User</h3>
                  <p className="text-2xl font-bold">
                    {stats?.avgSessionsPerUser}
                  </p>
                </div>
              </div>
            )}

            {/* 🔥 Smart Insights Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Smart Insights</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Jobs */}
                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Top Jobs</h3>
                  {stats?.topJobs?.length ? (
                    stats.topJobs.map((job: any, index: number) => (
                      <p key={index}>
                        {job._id} ({job.count})
                      </p>
                    ))
                  ) : (
                    <p>No data</p>
                  )}
                </div>

                {/* Top Skills */}
                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Top Skills</h3>
                  {stats?.topSkills?.length ? (
                    stats.topSkills.map((skill: any, index: number) => (
                      <p key={index}>
                        {skill._id} ({skill.count})
                      </p>
                    ))
                  ) : (
                    <p>No data</p>
                  )}
                </div>

                {/* Top Interests */}
                <div className="bg-white text-indigo-900 p-6 rounded shadow">
                  <h3 className="text-lg font-semibold mb-4">Top Interests</h3>
                  {stats?.topInterests?.length ? (
                    stats.topInterests.map((interest: any, index: number) => (
                      <p key={index}>
                        {interest._id} ({interest.count})
                      </p>
                    ))
                  ) : (
                    <p>No data</p>
                  )}
                </div>
              </div>
            </div>
            {/* 🔥 Most Active Users */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Most Active Users</h2>

              <div className="bg-white text-indigo-900 p-6 rounded shadow">
                {stats?.mostActiveUsers?.length ? (
                  stats.mostActiveUsers.map((user: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between border-b py-2"
                    >
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <p className="font-bold">{user.sessionCount}</p>
                    </div>
                  ))
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
            {/* 🔥 Sessions Over Time */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-6">Sessions Over Time</h2>

              <div className="bg-white text-indigo-900 p-6 rounded shadow h-[300px]">
                {chartData?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="sessions"
                        stroke="#4f46e5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "controls" && (
          <div className="text-white">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">User Management</h2>

              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="bg-white text-indigo-900 rounded shadow overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-indigo-100">
                      <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((u: any) => (
                        <tr key={u._id} className="border-t">
                          <td className="p-3">{u.name}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">{u.role}</td>
                          <td className="p-3">
                            <button
                              onClick={() => {
                                if (u._id === user?.id) {
                                  alert("You cannot delete yourself");
                                  return;
                                }
                                handleDeleteUser(u._id);
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
