import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../../services/todos";
import { Todo } from "../../types/todo";
import styles from "./TodoItem.module.css";

interface DeleteTodoProps extends Pick<Todo, "id"> {}

const DeleteTodo = ({ id }: DeleteTodoProps) => {
  const client = useQueryClient();

  const { mutate: toggle } = useMutation<Todo[]>({
    mutationFn: () => deleteTodo(id),
    onSuccess: () => client.invalidateQueries(),
  });

  return (
    <button
      className={styles.delete}
      title="Delete"
      onClick={() => toggle()}
      data-testid="delete"
      role="button"
    ></button>
  );
};

export default DeleteTodo;
