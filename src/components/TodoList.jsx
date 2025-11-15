import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load tasks + theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
    setTask("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    if (editingText.trim() === "") return;

    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editingText } : t)));

    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-5 bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            📝 To-Do App
          </h1>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter task..."
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-between mt-5 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          {["all", "completed", "pending"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg capitalize ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="mt-5 space-y-3">
          <AnimatePresence>
            {filteredTasks.map((t) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow"
              >
                {/* Editing Mode */}
                {editingId === t.id ? (
                  <div className="flex w-full items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full px-2 py-1 border rounded-lg dark:bg-gray-600 dark:text-white"
                    />

                    <button
                      onClick={() => saveEdit(t.id)}
                      className="text-green-600 font-bold hover:text-green-800"
                    >
                      ✔
                    </button>

                    <button
                      onClick={cancelEdit}
                      className="text-red-600 font-bold hover:text-red-800"
                    >
                      ✖
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Normal Mode */}
                    <span
                      onClick={() => toggleComplete(t.id)}
                      className={`cursor-pointer text-lg dark:text-white ${
                        t.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {t.text}
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(t.id, t.text)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteTask(t.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ❌
                      </button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default Todo;
