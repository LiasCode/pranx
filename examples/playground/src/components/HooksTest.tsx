import { useEffect, useState } from "preact/hooks";

export function HooksTest() {
  const [name, setName] = useState("Introduce your name");

  useEffect(() => {
    console.log("Hello Pranx!!!");
  }, []);

  useEffect(() => {
    console.log({ name });
  }, [name]);

  return (
    <>
      <h2>Hook Test</h2>

      <label>Name:</label>
      <input
        value={name}
        onInput={(e) => setName(e.currentTarget.value)}
      />
    </>
  );
}
