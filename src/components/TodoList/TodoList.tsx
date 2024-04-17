import { Spinner } from "../../services/Spiner/Spinner";
import useTodosQuery from "../../hooks/useTodosQuery";
import styles from "./TodoList.module.css";

import TodoItem from "../TodoItem/TodoITem";
import { TodoState } from "../../types/todo";
import { ErrorMessage } from "../AlertMessage/ErrorMessage";

type TodoListProps = {
  state: TodoState;
};

const TodoList = ({ state }: TodoListProps) => {
  const { data, isLoading, isSuccess, isError } = useTodosQuery(state);

  // if (isLoading) return <Spinner />;
  // if (isError) return <ErrorMessage />;

  return (
    <ul className={styles.list}>
      {data?.length === 0 ? <h2 className={styles.header}>No Task!</h2> : ""}
      {isLoading && <Spinner />}
      {isError && <ErrorMessage />}
      {isSuccess && data.map((todo) => <TodoItem key={todo.id} {...todo} />)}
    </ul>
  );
};

export default TodoList;
