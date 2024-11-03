import { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap'; 

interface TodoItem {
  _id: string; // id from backend
  name: string;
  description: string;
  day: string;
  complete: boolean;
}

function ListGroup() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    day: "",
    complete: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedItem, setSelectedItem] = useState<TodoItem | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        console.log(`Fetching todos from: ${apiUrl}/todos`);
        const response = await fetch(`${apiUrl}/todos`);
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data: TodoItem[] = await response.json();
        console.log("Fetched todos:", data);
        setItems(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setErrorMessage("Failed to fetch todos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [apiUrl]);

  // Handle changes in the form inputs
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Adding a new todo item
  const addTodo = async () => {
    if (!newTodo.name || !newTodo.day) {
      alert("Please enter a name and select a date.");
      return;
    }

    const todo = {
      name: newTodo.name,
      description: newTodo.description,
      day: newTodo.day,
      complete: newTodo.complete,
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }

      const data: TodoItem = await response.json();
      setItems((prevItems) => [...prevItems, data]);
      setNewTodo({ name: "", description: "", day: "", complete: false }); // Clear form inputs
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error adding todo:", error);
      setErrorMessage("Failed to add todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle todo item click
  const handleClick = (item: TodoItem) => {
    setSelectedItem(item);
  };

  // Close modal
  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Todo List</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {loading && <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>}

      <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              type="text"
              name="name"
              placeholder="Enter todo name"
              value={newTodo.name}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="description"
              placeholder="Enter todo description"
              value={newTodo.description}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <input
              type="date"
              name="day"
              value={newTodo.day}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-auto">
            <label className="form-check-label me-2">
              Completed:
            </label>
            <input
              type="checkbox"
              name="complete"
              checked={newTodo.complete}
              onChange={handleInputChange}
              className="form-check-input"
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Todo"}
            </button>
          </div>
        </div>
      </form>

      <div className="row">
        {items.length === 0 && <p>No todos found.</p>}
        {items.map((item) => (
          <div className="col-md-4 mb-3" key={item._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text"><small>Due Date: {item.day}</small></p>
                <p className="card-text"><small>Status: {item.complete ? "Complete" : "Incomplete"}</small></p>
                <button className="btn btn-info" onClick={() => handleClick(item)}>View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={!!selectedItem} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Todo Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <h5>Name: {selectedItem.name}</h5>
              <p>Description: {selectedItem.description}</p>
              <p>Due Date: {selectedItem.day}</p>
              <p>Status: {selectedItem.complete ? "Complete" : "Incomplete"}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>Close</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListGroup;
