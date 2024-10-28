function ListGroup(){

let items = ["Todo1", "Todo2","Todo3"]




 return(
    <>
     <h1>Todo List</h1>

     {items.length === 0 && <p>No items Found </p> }
    
      <ul className="list-group">
        {items.map((items)=>(
          <li className="list-group-items" key = {items} onClick={()=>console.log('clicked')}> {items}</li>))}
        </ul>
    </>);
}
export default ListGroup;