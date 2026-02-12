import { useEffect, useState } from "react";
import API from "../api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks || res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task
  const handleCreate = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/tasks", { title });
      setTitle("");
      setSuccess("Task created successfully");
      setError("");
      fetchTasks();
    } catch (err) {
      setError("Failed to create task");
      setSuccess("");
    }
  };

  // Toggle task completion
  const handleToggle = async (id, completed) => {
    try {
      await API.put(`/tasks/${id}`, {
        completed: !completed
      });
      fetchTasks();
    } catch (err) {
      setError("Failed to update task");
    }
  };

  // Delete task
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tasks</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreate}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: "10px" }}>
            <span
              style={{
                textDecoration: task.completed
                  ? "line-through"
                  : "none",
                marginRight: "10px"
              }}
            >
              {task.title}
            </span>

            <button
              onClick={() =>
                handleToggle(task._id, task.completed)
              }
            >
              {task.completed ? "Undo" : "Complete"}
            </button>

            <button
              onClick={() => handleDelete(task._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
