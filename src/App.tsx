import NewTodo from "./components/NewTodo/NewTodo";
import "./App.css";
import TodoViewer from "./components/TodoViewer/TodoViewer";

function App() {
  return (
    <>
      <div className="AppWrapper">
        <h1 className="logo">todos</h1>
        <NewTodo />
        <TodoViewer />
      </div>
    </>
  );
}

export default App;
