import React, { useState, useEffect } from 'react';

function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null);
  const apiUrl = "http://localhost:3000";

  useEffect(() => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos([...todos, data]);
          setMessage("Item added successfully");
          setTitle("");
          setDescription("");
        })
        .catch((err) => setError("Unable to create todo item"));
    }
  };

  const handleDelete = (id) => {
    fetch(apiUrl + `/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
        setMessage("Item deleted successfully");
      })
      .catch((err) => setError("Unable to delete todo item"));
  };

  const handleUpdate = (id) => {
    if (editing !== null) {
      fetch(apiUrl + `/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => res.json())
        .then((data) => {
          setTodos(
            todos.map((todo) => (todo._id === id ? { ...todo, title, description } : todo))
          );
          setMessage("Item updated successfully");
          setEditing(null);
          setTitle("");
          setDescription("");
        })
        .catch((err) => setError("Unable to update todo item"));
    }
  };

  return (
    <>
<div className="container">
  <div className="row p-3 bg-success text-light">
    <h1 className="display-4">ToDo Project with MERN Stack</h1>
  </div>
  <div className="row">
    <h3 className="text-center">Add Items</h3>
    {message && <p className="text-success">{message}</p>}
  </div>
  <form onSubmit={handleSubmit}>
    <div className="form-group d-flex gap-2">
      <input
        placeholder="Title..."
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="form-control form-control-lg shadow-sm"
        type="text"
        required
      />
      <input
        placeholder="Description..."
        onChange={(e) => setDescription(e.target.value)}
        value={description}
        className="form-control form-control-lg shadow-sm"
        type="text"
        required
      />
      <button className="btn btn-dark btn-lg shadow-sm">Submit</button>
    </div>
    {error && <p className="text-danger">{error}</p>}
  </form>
  <ul className="list-group">
    {todos.map((todo, index) => (
      <li key={index} className="list-group-item">
        {editing === todo._id? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control form-control-sm shadow-sm"
            type="text"
          />
        ) : (
          <span>
            <strong>{todo.title}</strong> - {todo.description}
          </span>
        )}
        <div className="btn-group float-right">
          <button
            className="btn btn-danger btn-sm shadow-sm mx-1 rounded-pill"
            onClick={() => handleDelete(todo._id)}
          >
            <i className="fas fa-trash-alt"></i> Delete
          </button>
          <button
            className="btn btn-primary btn-sm shadow-sm mx-1 rounded-pill"
            onClick={() => setEditing(todo._id)}
          >
            <i className="fas fa-edit"></i> Edit
          </button>
          {editing === todo._id && (
            <button
              className="btn btn-success btn-sm shadow-sm mx-1"
              onClick={() => handleUpdate(todo._id)}
            >
              <i className="fas fa-check"></i> Update
            </button>
          )}
        </div>
      </li>
    ))}
  </ul>
</div>
    </>
  );
}

export default Todo;