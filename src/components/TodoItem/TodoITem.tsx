import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodoStatus } from "../../services/todos";
import styles from "./TodoItem.module.css";
import { Todo } from "../../types/todo";
import DeleteTodo from "./DeleteTodo";
import { useState } from "react";

const TodoItem = ({ id, title, completed }: Todo) => {
  const client = useQueryClient();

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };
  const { mutate: toggle } = useMutation<Todo[]>({
    mutationFn: () => toggleTodoStatus(id, !completed),

    onSuccess: () => client.invalidateQueries(),
  });

  return (
    <li
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseOut}
      data-testid="todo-item"
      className={completed ? "completed" : ""}
    >
      <input
        className={styles.toggle}
        type="checkbox"
        checked={completed}
        onChange={() => toggle()}
        value={completed ? "on" : ""}
      />
      <label className={styles.label} data-testid={"todo-title"}>
        {title}
      </label>

      {isHovering && <DeleteTodo id={id} />}
    </li>
  );
};

export default TodoItem;
