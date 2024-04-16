import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styles from "./NewTodo.module.css";
import { createTodo } from "../../services/todos";
import { Todo } from "../../types/todo";

const NewTodo = () => {
  const [title, setTitle] = useState("");

  const client = useQueryClient();

  const { mutate: create } = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      client.setQueriesData<Todo[]>(["todos", "all"], (oldTodos) => {
        return [...(oldTodos || []), newTodo];
      });
      client.invalidateQueries({
        queryKey: ["todos", "all"],
        refetchType: "none",
      });
    },
  });

  const submit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (title) {
      create(title);
      setTitle("");
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add new todo"
      />
      <button type="submit" className={styles.btn}>
        {" "}
        Add Todo
      </button>
    </form>
  );
};

export default NewTodo;
