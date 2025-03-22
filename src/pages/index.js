import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [dueDate, setDueDate] = useState(null);

  // Load tasks & theme from local storage on mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const storedTheme = localStorage.getItem("darkMode") === "true";
    setTasks(storedTasks);
    setDarkMode(storedTheme);
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Reminder alert for due tasks
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.notified && new Date(task.dueDate) <= now) {
          alert(`⏰ Reminder: ${task.text}`);
          task.notified = true;
          setTasks([...tasks]); // Update state
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // Function to add a new task
  const addTask = (task, priority, dueDate) => {
    if (!dueDate) {
      alert("Please select a valid due date.");
      return;
    }
    setTasks([...tasks, { text: task, completed: false, priority, dueDate, notified: false }]);
  };

  // Function to remove a task
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Function to toggle task completion
  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  // ✅ Ensure JSX is inside return statement
  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="container">
        <h1>Task Manager</h1>

        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Task Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.target.elements.task;
            const priority = e.target.elements.priority.value;

            if (input.value.trim()) {
              addTask(input.value, priority, dueDate);
              input.value = "";
              setDueDate(null);
            }
          }}
        >
          <input type="text" name="task" placeholder="Enter a task" required />
          <select name="priority">
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            showTimeSelect
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            dateFormat="Pp"
            placeholderText="Select Due Date"
            minDate={new Date()}  // ⬅ Restricts selection to today & future dates
          />
<button type="submit">Add Task</button>
          <button type="submit">Add Task</button>
        </form>

        {/* Task List */}
        <ul>
        <ul>
  {tasks.map((task, index) => (
    <li
      key={index}
      className={task.completed ? "completed" : ""}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderLeft: `6px solid ${
          task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green"
        }`,
        padding: "10px",
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, overflow: "hidden" }}>
        <strong
          style={{
            color: task.priority === "High" ? "red" : task.priority === "Medium" ? "orange" : "green",
            marginRight: "5px",
          }}
        >
          {task.priority}:
        </strong>
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            maxWidth: "60%",
            verticalAlign: "middle",
          }}
          title={task.text} // Shows full text on hover
        >
          {task.text}
        </span>
        {task.dueDate && (
          <span
            style={{
              fontSize: "12px",
              color: "#666",
              marginLeft: "10px",
              whiteSpace: "nowrap",
            }}
          >
            ⏳ {new Date(task.dueDate).toLocaleString()}
          </span>
        )}
      </div>
      <div>
        <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(index)} />
        <button onClick={() => removeTask(index)}>🗑</button>
      </div>
    </li>
  ))}
</ul>

        </ul>
      </div>

      {/* CSS */}
      <style jsx>{`
        body {
          transition: background 0.3s, color 0.3s;
        }
        .light {
          background: #f9f9f9;
          color: #222;
        }
        .dark {
          background: #222;
          color: #fff;
        }
        .container {
          max-width: 500px;
          margin: auto;
          text-align: center;
          padding: 20px;
        }
        .theme-toggle {
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          margin-bottom: 10px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin: 10px 0;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #ccc;
          border-radius: 5px;
          position: relative;
        }
        .completed {
          text-decoration: line-through;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
