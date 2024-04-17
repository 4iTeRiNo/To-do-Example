import { useQuery } from "@tanstack/react-query";
import { fetchTodos } from "../services/todos";
import { TodoState } from "../types/todo";

const useTodosQuery = (state: TodoState) => {
  return useQuery({
    queryFn: () => fetchTodos(state),
    queryKey: ["todos", state],
    staleTime: 1000 * 2,
    onError: (err: Error) => {
      if (err instanceof Error) {
        return err.message;
      }
    },
  });
};

export default useTodosQuery;
