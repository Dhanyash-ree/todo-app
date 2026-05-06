"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;

    await fetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        text: task,
        done: false,
        priority,
      }),
    });

    setTask("");
    fetchTasks();
  };

  const toggleTask = async (index) => {
    await fetch("/api/tasks", {
      method: "PUT",
      body: JSON.stringify({ index }),
    });
    fetchTasks();
  };

  const deleteTask = async (index) => {
    await fetch("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({ index }),
    });
    fetchTasks();
  };

 const clearCompleted = async () => {
  const remaining = tasks.filter((t) => !t.done);

  await fetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify({
      type: "RESET",
      tasks: remaining,
    }),
  });

  fetchTasks();
};

  // ✅ FIXED LOGIC (important)
  const processedTasks = tasks
    .map((t, i) => ({ ...t, originalIndex: i }))
    .filter((t) => {
      if (filter === "Active") return !t.done;
      if (filter === "Completed") return t.done;
      return true;
    });

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>✨ Smart Todo Pro</h1>

        {/* Input */}
        <div style={styles.inputBox}>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task..."
            style={styles.input}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.select}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button onClick={addTask} style={styles.addBtn}>
            Add
          </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          {["All", "Active", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                ...styles.filterBtn,
                background: filter === f ? "#667eea" : "#eee",
                color: filter === f ? "white" : "black",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <ul style={styles.list}>
          {processedTasks.length === 0 ? (
            <p style={styles.empty}>No tasks here 🚀</p>
          ) : (
            processedTasks.map((t, i) => (
              <li key={i} style={styles.item}>
                <span
                  onClick={() => toggleTask(t.originalIndex)}
                  style={{
                    ...styles.taskText,
                    textDecoration: t.done ? "line-through" : "none",
                  }}
                >
                  {t.text} ({t.priority})
                </span>

                <button onClick={() => deleteTask(t.originalIndex)}>
                  ❌
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Clear completed */}
        <button onClick={clearCompleted} style={styles.clearBtn}>
          Clear Completed
        </button>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: { textAlign: "center" },
  inputBox: { display: "flex", gap: "10px", marginTop: "10px" },
  input: { flex: 1, padding: "10px", borderRadius: "6px" },
  select: { padding: "10px", borderRadius: "6px" },
  addBtn: {
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  filterBtn: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: { listStyle: "none", marginTop: "15px", padding: 0 },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "#f5f5f5",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  taskText: { cursor: "pointer" },
  empty: { textAlign: "center", color: "#888" },
  clearBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};