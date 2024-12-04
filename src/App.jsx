import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { collection_id, databases, db_id } from "./lib/appwrite";
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]); // State for todos
  const [newTodo, setNewTodo] = useState(""); // New todo input
  const [editingTodo, setEditingTodo] = useState(null); // Editing state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(db_id, collection_id);
      setTodos(res.documents);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const todo = { text: newTodo, completed: false };
      const res = await databases.createDocument(db_id, collection_id, "unique()", todo);
      setTodos([...todos, res]);
      setNewTodo(""); // Clear input
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  // Update a todo
  const updateTodo = async (id, updatedFields) => {
    try {
      const res = await databases.updateDocument(db_id, collection_id, id, updatedFields);
      setTodos(todos.map((todo) => (todo.$id === id ? res : todo)));
      setEditingTodo(null); // Exit editing mode
    } catch (err) {
      console.error("Failed to update todo:", err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await databases.deleteDocument(db_id, collection_id, id);
      setTodos(todos.filter((todo) => todo.$id !== id));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 tracking-tight">
        My Todo List
      </h1>

      {/* Add Todo */}
      <div className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-grow p-2 text-gray-800 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
        />
        <button
          onClick={addTodo}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition"
        >
          <FaPlus  className="h-5 w-5" />
          <span>Add</span>
        </button>
      </div>

      {/* Todo List */}
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500 animate-pulse">Loading...</p>
          </div>
        ) : todos.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {todos.map((todo) => (
              <li
                key={todo.$id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg"
              >
                {/* Editable Todo */}
                {editingTodo === todo.$id ? (
                  <input
                    type="text"
                    value={todo.text}
                    onChange={(e) =>
                      updateTodo(todo.$id, { text: e.target.value })
                    }
                    className="flex-grow p-2 text-gray-800 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                  />
                ) : (
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        todo.completed ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span
                      className={`text-lg font-medium ${
                        todo.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      updateTodo(todo.$id, { completed: !todo.completed })
                    }
                    className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                      todo.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {todo.completed ? "Mark Incomplete" : "Mark Complete"}
                  </button>
                  <button
                    onClick={() => setEditingTodo(todo.$id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                  >
                    <FaPencilAlt className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.$id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-500">No todos found.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 text-sm text-gray-500">
        Built with <span className="text-indigo-500">Tailwind CSS</span>, React & Appwrite
      </footer>
    </div>
  );
}

export default App;
