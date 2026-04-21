import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const priorityStyles = {
  low:    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  high:   "bg-red-500/15 text-red-400 border-red-500/20",
};

const statusStyles = {
  "pending":     "bg-slate-500/15 text-slate-400 border-slate-500/20",
  "in-progress": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "completed":   "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const inputCls = "w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", status: "pending" });
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data.tasks);
    } catch {
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const flash = (msg, type = "success") => {
    type === "success" ? setSuccess(msg) : setError(msg);
    setTimeout(() => { setSuccess(""); setError(""); }, 3000);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", priority: "medium", status: "pending" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, form);
        flash("Task updated successfully!");
      } else {
        await api.post("/tasks", form);
        flash("Task created successfully!");
      }
      resetForm();
      fetchTasks();
    } catch (err) {
      flash(err.response?.data?.message || "Error saving task.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setForm({ title: task.title, description: task.description || "", priority: task.priority, status: task.status });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      flash("Task deleted.");
      fetchTasks();
    } catch {
      flash("Error deleting task.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-xs">⚡</span>
            </div>
            <span className="font-bold tracking-tight">Task Manager</span>
          </div>
          <span className="text-slate-500 text-sm">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Flash messages */}
        {error && (
          <div className="mb-5 flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-xl">
            ✅ {success}
          </div>
        )}

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-5">
            {editId ? "✏️ Edit Task" : "➕ New Task"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className={inputCls}
              placeholder="Task title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <textarea
              className={`${inputCls} h-20 resize-none`}
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider font-medium">Priority</label>
                <select
                  className={inputCls}
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wider font-medium">Status</label>
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option className="bg-indigo-300" value="pending">Pending</option>
                  <option className="bg-indigo-300" value="in-progress">In Progress</option>
                  <option className="bg-indigo-300" value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-500/20"
              >
                {submitting ? "Saving..." : editId ? "Update Task" : "Create Task"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium px-5 py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center text-slate-500 py-20">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-400">No tasks yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white mb-1 truncate">{task.title}</h4>
                    {task.description && (
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className={`border text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`border text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[task.status]}`}>
                        {task.status}
                      </span>
                      {task.owner?.name && (
                        <span className="text-xs text-slate-500">by {task.owner.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-indigo-500/15 hover:bg-indigo-500/30 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red-500/15 hover:bg-red-500/30 border border-red-500/20 text-red-400 text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}