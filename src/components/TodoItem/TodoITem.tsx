import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTodoStatus } from "../../services/todos";
import styles from "./TodoItem.module.css";
import { Todo } from "../../types/todo";
import DeleteTodo from "./DeleteTodo";
import classNames from "classnames";

const TodoItem = ({ id, title, completed }: Todo) => {
  const client = useQueryClient();

  const { mutate: toggle } = useMutation<Todo[]>({
    mutationFn: () => toggleTodoStatus(id, !completed),

    onSuccess: () => client.invalidateQueries(),
  });

  return (
    <li className={styles.item}>
      <label className={styles.label}>
        <input
          className={styles.customCheckbox}
          id="checkbox"
          type="checkbox"
          checked={completed}
          onChange={() => toggle()}
        />
        <div className={styles.check}></div>
        <span
          className={classNames(
            styles.text,
            !completed ? "" : styles.textDecoration
          )}
        >
          {title}
        </span>
      </label>
      <DeleteTodo id={id} />
    </li>
  );
};

export default TodoItem;
