function ListGroup(){

const items = ["Todo1", "Todo2","Todo3"]

 return(
    <>
     <h1>Todo List</h1>

      (<ul className="list-group">
        {items.map((items)=>(<li>{items}</li>))}
        </ul>
    </>);
}
export default ListGroup;