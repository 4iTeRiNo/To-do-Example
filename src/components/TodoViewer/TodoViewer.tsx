import { useState } from "react";
import styles from "./TodoViewer.module.css";
import TodoList from "../TodoList/TodoList";
import { TodoState } from "../../types/todo";
import Button from "../Button/Button";

const TodoViewer = () => {
  const [view, setView] = useState<TodoState>("all");

  return (
    <div className={styles.wrapperViewer}>
      <TodoList state={view} />
      <Button setView={setView} />
    </div>
  );
};

export default TodoViewer;
