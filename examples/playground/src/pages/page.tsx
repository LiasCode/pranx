import { useState } from "preact/hooks";
import Docs from "../data/docs.md";

export default function HomePage(props: any) {
  const [counter, setCounter] = useState(10);
  console.log("HomePage props:", props);

  return (
    <div>
      <a href={"/"}>Home</a>
      <hr />
      <a href={"/products"}>Products</a>
      <h1>Home</h1>
      {counter}
      <button onClick={() => setCounter((c) => c + 1)}>+1</button>
      <Docs />
    </div>
  );
}
