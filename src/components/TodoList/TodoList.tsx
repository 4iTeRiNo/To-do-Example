import { Spinner } from "../../services/Spiner/Spinner";
import useTodosQuery from "../../hooks/useTodosQuery";
import styles from "./TodoList.module.css";

import TodoItem from "../TodoItem/TodoITem";
import { TodoState } from "../../types/todo";

type TodoListProps = {
  state: TodoState;
};

const TodoList = ({ state }: TodoListProps) => {
  const { data, isLoading, isSuccess } = useTodosQuery(state);

  if (isLoading) return <Spinner />;

  return (
    <ul className={styles.list}>
      {isSuccess && data.map((todo) => <TodoItem key={todo.id} {...todo} />)}
    </ul>
  );
};

export default TodoList;
