import { useState } from "preact/hooks";

export const CounterButton = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((prev) => prev + 1)}>This is the client count: {count}</button>;
};
