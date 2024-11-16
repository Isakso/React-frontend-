import { useState, useEffect, ChangeEvent } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Tab, Tabs, Form, Button } from 'react-bootstrap';

// Define the TodoItem interface
interface TodoItem {
  _id: string;
  name: string;
  description: string;
  day: string; 
  complete: boolean;
}

// Array of days of the week
const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

function ListGroup() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    day: "",
    complete: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [activeTab, setActiveTab] = useState("allTodos");

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch todos on component mount
  useEffect(() => {
    fetchAllTodos();
  }, [apiUrl]);

  // Fetch all todos from the API
  const fetchAllTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/todos`);
      if (!response.ok) throw new Error("Failed to fetch todos");

      const data: TodoItem[] = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setErrorMessage("Failed to fetch todos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos by day from the API
  const fetchTodosByDay = async (day: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/todos/${day}`);
      if (!response.ok) throw new Error("Failed to fetch todos by day");

      const data: TodoItem[] = await response.json();
      setFilteredItems(data);
    } catch (error) {
      console.error(`Error fetching todos for ${day}:`, error);
      setErrorMessage("Failed to fetch todos for the selected day. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change for the new todo form
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle day change for the dropdown
  const handleDayChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = event.target.value;
    setNewTodo((prevTodo) => ({
      ...prevTodo,
      day: selectedDay, // Update the newTodo with selected day
    }));
    setSelectedDay(selectedDay); // Update selected day for filtering
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.name || !newTodo.day) {
      alert("Please enter a name and select a day.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) throw new Error("Failed to add todo");

      await fetchAllTodos(); // Refresh the list of todos
      setNewTodo({ name: "", description: "", day: "", complete: false }); // Reset the form
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding todo:", error);
      setErrorMessage("Failed to add todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle tab selection
  const handleTabSelect = (key: string | null) => {
    if (key) {
      setActiveTab(key);
      if (key === "allTodos") {
        fetchAllTodos();
      } else if (key === "todosByDay" && selectedDay) {
        fetchTodosByDay(selectedDay);
      }
    }
  };

  // Filter todos by selected day
  const filterByDay = () => {
    if (selectedDay) {
      fetchTodosByDay(selectedDay);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Todo List</h1>

      {/* Display error message */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Loading spinner */}
      {loading && <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>}

      {/* Add Todo Form */}
      <Form onSubmit={(e) => { e.preventDefault(); addTodo(); }} className="mb-4">
        <div className="row">
          <Form.Group className="col">
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter todo name"
              value={newTodo.name}
              onChange={handleInputChange}
              
              required
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Control
              type="text"
              name="description"
              placeholder="Enter todo description"
              value={newTodo.description}
              onChange={handleInputChange}

            />
          </Form.Group>
          <Form.Group className="col">
            {/* Dropdown for selecting day of the week */}
            <Form.Select name="day" value={newTodo.day} onChange={handleDayChange} required>
              <option value="" disabled>Select a day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="col-auto d-flex align-items-center">
            <Form.Check
              type="checkbox"
              name="complete"
              label="Completed"
              checked={newTodo.complete}
              onChange={handleInputChange}

            />
          </Form.Group>
          <Button className="col-auto" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Todo"}
          </Button>
        </div>
      </Form>

      {/* Tabs for viewing todos */}
      <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
        <Tab eventKey="allTodos" title="All Todos">
          <div className="row">
            {items.length === 0 && <p>No todos found.</p>}
            {items.map((item) => (
              <div className="col-md-4 mb-3" key={item._id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p>{item.description}</p>
                    <small>Due Day: {item.day}</small><br />
                    <small>Status: {item.complete ? "Complete" : "Incomplete"}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tab>

        <Tab eventKey="todosByDay" title="Todos by Day">
          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)} // Update selected day
            >
              <option value="" disabled>Select a day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </Form.Control>
            <Button className="mt-2" onClick={filterByDay}>Fetch Todos</Button>
          </Form.Group>
          <div className="row">
            {filteredItems.length === 0 && <p>No todos found for the selected day.</p>}
            {filteredItems.map((item) => (
              <div className="col-md-4 mb-3" key={item._id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p>{item.description}</p>
                    <small>Due Day: {item.day}</small><br />
                    <small>Status: {item.complete ? "Complete" : "Incomplete"}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default ListGroup;
