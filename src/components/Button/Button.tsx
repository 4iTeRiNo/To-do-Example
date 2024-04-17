import { Dispatch, SetStateAction, useState } from "react";
// import { Pressure, ThermometerIcon, WindyIcon } from "../../SGVIcons";
import classNames from "classnames";
import styles from "./Button.module.css";
import { TodoState } from "../../types/todo";

interface ButtonProps {
  setView: Dispatch<SetStateAction<TodoState>>;
}

export const Button = ({ setView }: ButtonProps) => {
  const [isPressed, setIsPressed] = useState("0");

  const buttonsData = [
    { id: "0", request: "all", name: "all" },
    { id: "1", request: "open", name: "open" },
    { id: "2", request: "completed", name: "completed" },
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.currentTarget.dataset.id) {
      setIsPressed(event.currentTarget.dataset.id);
    }
    if (event.currentTarget.dataset.request) {
      //@ts-ignore
      setView(event.currentTarget.dataset.request);
    }
  };

  return (
    <div className={styles.navigate}>
      {buttonsData.map((el) => {
        return (
          <button
            type="submit"
            name={el.request}
            key={el.id}
            data-id={el.id}
            data-request={el.request}
            className={classNames(
              styles.button,
              isPressed === el.id ? styles.active : ""
            )}
            onClick={handleClick}
          >
            {el.name}
          </button>
        );
      })}
    </div>
  );
};

export default Button;
