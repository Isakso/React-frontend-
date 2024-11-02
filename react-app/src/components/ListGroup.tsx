import { useState, useEffect, MouseEvent, ChangeEvent } from "react";

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
  const apiUrl = import.meta.env.VITE_API_URL; 

  // Fetch todos on component mount
  useEffect(() => {
    const fetchTodos = async () => {
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
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // track selected item for highlighting
  const [selectedItem, setSelectedItem] = useState<TodoItem | null>(null);

  const handleClick = (event: MouseEvent, item: TodoItem) => {
    console.log(`Alt key pressed: ${event.altKey}`);
    setSelectedItem(item);
  };

  return (
    <>
      <h1>Todo List</h1>

      <form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Enter todo name"
          value={newTodo.name}
          onChange={handleInputChange}
          className="form-control"
        />
        <input
          type="text"
          name="description"
          placeholder="Enter todo description"
          value={newTodo.description}
          onChange={handleInputChange}
          className="form-control"
        />
        <input
          type="date"
          name="day"
          value={newTodo.day}
          onChange={handleInputChange}
          className="form-control"
        />
        <label>
          Completed:
          <input
            type="checkbox"
            name="complete"
            checked={newTodo.complete}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>

      {items.length === 0 && <p>No items found</p>}
      <ul className="list-group">
        {items.map((item) => (
          <li
            key={item._id}
            className={`list-group-item ${item === selectedItem ? "active" : ""}`}
            onClick={(event) => handleClick(event, item)}
            style={{ cursor: "pointer" }}
          >
            <strong>{item.name}</strong> - {item.description} <br />
            <small>Due Date: {item.day}</small> <br />
            <small>Status: {item.complete ? "Complete" : "Incomplete"}</small>
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
