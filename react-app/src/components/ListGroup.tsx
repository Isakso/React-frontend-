import { useState, MouseEvent } from "react";

function ListGroup() {
  //  items
  let items = ["Todo1", "Todo2", "Todo3"];

  // State to track selected item
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Handle item click
  const handleClick = (event: MouseEvent, item: string) => {
    console.log(`Alt key pressed: ${event.altKey}`);
    setSelectedItem(item); // Set the selected item
  };

  return (
    <>
      <h1>Todo List</h1>

      {items.length === 0 && <p>No items Found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            key={item}
            className={`list-group-item ${item === selectedItem ? "active" : ""}`} // Highlights selected item
            onClick={(event) => handleClick(event, item)}
            style={{ cursor: "pointer" }} // cursor
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
