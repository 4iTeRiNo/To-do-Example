import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../../services/todos";
import { Todo } from "../../types/todo";

interface DeleteTodoProps extends Pick<Todo, "id"> {}

const DeleteTodo = ({ id }: DeleteTodoProps) => {
  const client = useQueryClient();

  const { mutate: toggle } = useMutation<Todo[]>({
    mutationFn: () => deleteTodo(id),
    onSuccess: () => client.invalidateQueries(),
  });

  return (
    <span className="delete" onClick={() => toggle()} role="button">
      &times;
    </span>
  );
};

export default DeleteTodo;
