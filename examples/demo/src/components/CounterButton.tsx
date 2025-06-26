import { useState } from "preact/hooks";
import "./counter_button.css";

export const CounterButton = () => {
  const [count, setCount] = useState(20);
  return (
    <button
      class="counter_button"
      onClick={() => setCount((prev) => prev + 1)}
    >
      This is the client count: {count}
    </button>
  );
};
