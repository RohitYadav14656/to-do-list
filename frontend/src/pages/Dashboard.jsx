import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow shadow-indigo-500/40">
              <span className="text-sm">⚡</span>
            </div>
            <span className="font-bold text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/tasks"
              className="text-slate-300 hover:text-white text-sm font-medium transition"
            >
              My Tasks
            </Link>
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white text-sm transition border border-white/10 px-3 py-1.5 rounded-lg hover:border-white/20"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="mb-10">
          <p className="text-indigo-400 text-sm font-medium mb-1">Welcome back</p>
          <h2 className="text-4xl font-bold tracking-tight">
            Hello, {user?.name} 👋
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {user?.email} ·{" "}
            <span className="text-indigo-400 font-medium capitalize">{user?.role}</span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tasks card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition">
              <span className="text-xl">📋</span>
            </div>
            <h3 className="font-semibold text-white mb-1">Task Manager</h3>
            <p className="text-slate-400 text-sm mb-5">Create, update and track your tasks.</p>
            <Link to="/tasks">
              <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                Go to Tasks →
              </button>
            </Link>
          </div>

          {/* Admin card */}
          {user?.role === "admin" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-300 group">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition">
                <span className="text-xl">👑</span>
              </div>
              <h3 className="font-semibold text-white mb-1">Admin Panel</h3>
              <p className="text-slate-400 text-sm mb-4">You have elevated access to manage all users and tasks.</p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 text-amber-400 text-xs">
                Access via <code className="font-mono">GET /api/v1/users</code>
              </div>
            </div>
          )}

          {/* Swagger docs card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300 group">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition">
              <span className="text-xl">📖</span>
            </div>
            <h3 className="font-semibold text-white mb-1">API Docs</h3>
            <p className="text-slate-400 text-sm mb-5">Explore all endpoints via Swagger UI.</p>
            <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer">
              <button className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-medium py-2.5 rounded-xl transition-all">
                Open Swagger →
              </button>
            </a>
          </div>
        </div>

        {/* API Overview */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">⚡ API Endpoints Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-mono">
            {[
              { method: "POST", color: "bg-green-500/20 text-green-400", path: "/api/v1/auth/register" },
              { method: "POST", color: "bg-green-500/20 text-green-400", path: "/api/v1/auth/login" },
              { method: "GET",  color: "bg-blue-500/20 text-blue-400",   path: "/api/v1/auth/me" },
              { method: "GET",  color: "bg-blue-500/20 text-blue-400",   path: "/api/v1/tasks" },
              { method: "POST", color: "bg-green-500/20 text-green-400", path: "/api/v1/tasks" },
              { method: "PUT",  color: "bg-amber-500/20 text-amber-400", path: "/api/v1/tasks/:id" },
              { method: "DELETE",color:"bg-red-500/20 text-red-400",     path: "/api/v1/tasks/:id" },
              { method: "GET",  color: "bg-blue-500/20 text-blue-400",   path: "/api/v1/users (admin)" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/3 rounded-xl px-3 py-2">
                <span className={`${r.color} px-2 py-0.5 rounded text-xs font-bold min-w-14.5 text-center`}>{r.method}</span>
                <span className="text-slate-300 text-xs">{r.path}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}