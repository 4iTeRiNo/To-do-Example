import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodoStatus } from "../../services/todos";
import styles from "./TodoItem.module.css";
import { Todo } from "../../types/todo";
import DeleteTodo from "./DeleteTodo";

const TodoItem = ({ id, title, completed }: Todo) => {
  const client = useQueryClient();
  const { mutate: toggle } = useMutation<Todo[]>({
    mutationFn: () => toggleTodoStatus(id, !completed),

    onSuccess: () => client.invalidateQueries(),
  });

  return (
    <li data-testid="todo-item" className={completed ? "completed" : ""}>
      <input
        className={styles.toggle}
        type="checkbox"
        checked={completed}
        onChange={() => toggle()}
        value={id}
      />
      <label className={styles.label} data-testid={"todo-title"}>
        {title}
      </label>
      <DeleteTodo id={id} />
    </li>
  );
};

export default TodoItem;
